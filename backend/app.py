from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token
)
import uuid

app = Flask(__name__)

# ---------------- CONFIG ----------------
app.config["JWT_SECRET_KEY"] = "secret123"  # change in production
CORS(app)
jwt = JWTManager(app)

# ---------------- TEMP DATABASE ----------------
# (For academic phase – can be replaced by MySQL/PostgreSQL later)
users = []

# ---------------- REGISTER ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    # Basic validation
    required_fields = ["name", "email", "password", "role"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    # Check duplicate email
    for user in users:
        if user["email"] == data["email"]:
            return jsonify({"error": "Email already registered"}), 409

    # Create user
    new_user = {
        "id": str(uuid.uuid4()),
        "name": data["name"],
        "email": data["email"],
        "password": data["password"],  # hashing later (future scope)
        "role": data["role"]
    }

    users.append(new_user)

    return jsonify({
        "message": "User registered successfully",
        "role": new_user["role"]
    }), 201


# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    if "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password required"}), 400

    for user in users:
        if user["email"] == data["email"] and user["password"] == data["password"]:
            access_token = create_access_token(identity=user["email"])

            # Base response
            response = {
                "token": access_token,
                "role": user["role"],
                "name": user["name"]
            }

            # Role-specific data
            if user["role"] == "consumer":
                response["consumer_no"] = f"CN-{user['id'][:6].upper()}"

            elif user["role"] == "technician":
                response["technician_id"] = f"TECH-{user['id'][:6].upper()}"

            return jsonify(response), 200

    return jsonify({"error": "Invalid credentials"}), 401


# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
