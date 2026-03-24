from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
import uuid
from datetime import datetime
import google.generativeai as genai
from pymongo import MongoClient

# 🔐 Gemini API Key
genai.configure(api_key="AIzaSyBaBvZaEcnM7iINHW7jcKhesDq9ICXRai0")

# ⚡ Model
model = genai.GenerativeModel("gemini-2.5-flash")

app = Flask(__name__)

# ================= CONFIG =================
app.config["JWT_SECRET_KEY"] = "secret123"

CORS(app)
jwt = JWTManager(app)

# ================= MONGODB =================
client = MongoClient("mongodb+srv://Nandhu:admin123@cluster0.ckm3r9h.mongodb.net/?retryWrites=true&w=majority")
db = client["smartgrid_db"]

users_collection = db["users"]
issues_collection = db["issues"]
notifications_collection = db["notifications"]
payments_collection = db["payments"]

# =================================================
# ================= AUTH ===========================
# =================================================

@app.route("/register", methods=["POST"])
def register():
    data = request.json

    required = ["name", "email", "password", "role"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 409

    if data["role"] == "consumer" and not data.get("consumer_no"):
        return jsonify({"error": "Consumer number is required"}), 400

    if data["role"] == "consumer":
        if users_collection.find_one({"consumer_no": data["consumer_no"]}):
            return jsonify({"error": "Consumer number not available"}), 409

    user_id = str(uuid.uuid4())

    user = {
        "id": user_id,
        "name": data["name"],
        "email": data["email"],
        "password": data["password"],
        "role": data["role"],
        "consumer_no": data.get("consumer_no"),

        # Technician ID
        "technician_id": f"TECH-{user_id[:6].upper()}" if data["role"] == "technician" else None,

        # Approval system
        "is_approved": False if data["role"] == "technician" else True
    }

    users_collection.insert_one(user)

    return jsonify({"message": "User registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    # 👤 CONSUMER LOGIN
    if "consumer_no" in data:
        user = users_collection.find_one({
            "consumer_no": data["consumer_no"],
            "password": data["password"],
            "role": "consumer"
        })

        if not user:
            return jsonify({"error": "Invalid consumer credentials"}), 401

        token = create_access_token(identity=user["consumer_no"])
        user["_id"] = str(user["_id"])
        return jsonify({"token": token, "user": user})

    # 🛠 TECHNICIAN LOGIN
    if "email" in data:
        user = users_collection.find_one({
            "email": data["email"],
            "password": data["password"],
            "role": "technician"
        })

        if not user:
            return jsonify({"error": "Invalid technician credentials"}), 401

        # Approval check
        if not user.get("is_approved"):
            return jsonify({"error": "Wait for admin approval"}), 403

        token = create_access_token(identity=user["email"])
        user["_id"] = str(user["_id"])
        return jsonify({"token": token, "user": user})

    return jsonify({"error": "Invalid login request"}), 400


# =================================================
# 🟢 ADMIN ROUTES
# =================================================

@app.route("/api/technicians/pending", methods=["GET"])
def get_pending_technicians():
    techs = list(users_collection.find({
        "role": "technician",
        "is_approved": False
    }))

    for t in techs:
        t["_id"] = str(t["_id"])

    return jsonify(techs)


@app.route("/api/technicians/approve/<tech_id>", methods=["PATCH"])
def approve_technician(tech_id):
    data = request.json

    # ✅ NEW AREA FIELD (NO LOGIC CHANGE)
    area = data.get("area")

    users_collection.update_one(
        {"id": tech_id},
        {
            "$set": {
                "is_approved": True,
                "assigned_area": area
            }
        }
    )

    return jsonify({"message": "Technician approved & area assigned"})


# =================================================
# ================= ISSUES =========================
# =================================================

@app.route("/api/issues", methods=["POST"])
def create_issue():
    data = request.json

    issue = {
        "id": str(uuid.uuid4()),
        "consumer_no": data["consumer_no"],
        "category": data["category"],
        "urgency": data["urgency"],
        "location": data["location"],
        "description": data.get("description", ""),
        "status": "Pending",
        "technician_note": "",
        "created_at": datetime.now().isoformat()
    }

    issues_collection.insert_one(issue)

    return jsonify({"message": "Issue reported successfully"})


@app.route("/api/issues/consumer/<consumer_no>", methods=["GET"])
def get_consumer_issues(consumer_no):
    issues = list(issues_collection.find({"consumer_no": consumer_no}))

    for i in issues:
        i["_id"] = str(i["_id"])

    return jsonify(issues)


@app.route("/api/issues", methods=["GET"])
def get_all_issues():
    issues = list(issues_collection.find())

    for i in issues:
        i["_id"] = str(i["_id"])

    return jsonify(issues)


@app.route("/api/issues/<issue_id>", methods=["PATCH"])
def update_issue(issue_id):
    data = request.json

    issue = issues_collection.find_one({"id": issue_id})

    if not issue:
        return jsonify({"error": "Issue not found"}), 404

    issues_collection.update_one(
        {"id": issue_id},
        {"$set": {
            "status": data.get("status", issue["status"]),
            "technician_note": data.get("technician_note", issue["technician_note"])
        }}
    )

    return jsonify({"message": "Issue updated successfully"})


# =================================================
# 🔔 NOTIFICATIONS
# =================================================

@app.route("/api/notifications", methods=["POST", "OPTIONS"])
def send_notification():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json

    notification = {
        "id": str(uuid.uuid4()),
        "consumer_no": data["consumer_no"],
        "title": data.get("title", "Notification"),
        "message": data["message"],
        "type": data.get("type", "issue"),
        "is_read": False,
        "created_at": datetime.now().isoformat()
    }

    notifications_collection.insert_one(notification)

    return jsonify({"message": "Notification sent"})


@app.route("/api/notifications/<consumer_no>", methods=["GET"])
def get_notifications(consumer_no):
    notifications = list(
        notifications_collection.find({"consumer_no": consumer_no})
    )

    for n in notifications:
        n["_id"] = str(n["_id"])

    return jsonify(notifications)


@app.route("/api/notifications/<notification_id>/read", methods=["PATCH"])
def mark_notification_read(notification_id):
    result = notifications_collection.update_one(
        {"id": notification_id},
        {"$set": {"is_read": True}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Notification not found"}), 404

    return jsonify({"message": "Notification marked as read"})


@app.route("/api/notifications/broadcast", methods=["POST", "OPTIONS"])
def broadcast_notification():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json

    consumers = list(users_collection.find({"role": "consumer"}))

    for consumer in consumers:
        notification = {
            "id": str(uuid.uuid4()),
            "consumer_no": consumer["consumer_no"],
            "title": data.get("title"),
            "message": data["message"],
            "type": data.get("type"),
            "is_read": False,
            "created_at": datetime.now().isoformat()
        }

        notifications_collection.insert_one(notification)

    return jsonify({"message": "Broadcast sent"})

# =================================================
# 💳 PAYMENT API
# =================================================

@app.route("/api/pay", methods=["POST"])
def make_payment():
    data = request.json

    consumer_no = data.get("consumer_no")
    amount = data.get("amount")

    if not consumer_no:
        return jsonify({"error": "Consumer number required"}), 400

    payment = {
        "id": str(uuid.uuid4()),
        "consumer_no": consumer_no,
        "amount": amount,
        "status": "Paid",
        "created_at": datetime.now().isoformat()
    }

    payments_collection.insert_one(payment)

    return jsonify({
        "message": "Payment successful",
        "status": "Paid"
    })

# =================================================
# 💳 PAYMENT STATUS
# =================================================

@app.route("/api/payment/<consumer_no>", methods=["GET"])
def get_payment_status(consumer_no):
    payment = payments_collection.find_one(
        {"consumer_no": consumer_no},
        sort=[("created_at", -1)]
    )

    if not payment:
        return jsonify({"status": "Unpaid"})

    return jsonify({"status": payment["status"]})


@app.route("/api/payments/<consumer_no>", methods=["GET"])
def get_payment_history(consumer_no):
    payments = list(
        payments_collection.find({"consumer_no": consumer_no})
        .sort("created_at", -1)
    )

    for p in payments:
        p["_id"] = str(p["_id"])

    return jsonify(payments)



# =================================================
# 🤖 CHATBOT
# =================================================

@app.route("/api/chatbot", methods=["GET", "POST", "OPTIONS"])
def chatbot():

    if request.method == "GET":
        return jsonify({"reply": "Chatbot working ✅"})

    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.get_json()
    message = data.get("message")

    if not message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = model.generate_content(f"User: {message}")
        reply_text = getattr(response, "text", "No response")
        return jsonify({"reply": reply_text})

    except Exception as e:
        print("❌ GEMINI ERROR:", str(e))
        return jsonify({"reply": "⚠️ AI error"})


# =================================================
# RUN
# =================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)