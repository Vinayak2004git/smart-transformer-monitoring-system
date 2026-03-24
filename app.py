from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def dashboard():
    dashboard_data = {
        "active_transformers": 4,
        "total_load": 8540,
        "active_faults": 2,
        "system_health": 98
    }
    return render_template("dashboard.html", data=dashboard_data)

if __name__ == "__main__":
    app.run(debug=True)
