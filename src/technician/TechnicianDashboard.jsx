// src/technician/TechnicianDashboard.jsx
import React, { useEffect, useState } from "react";
import "./TechnicianDashboard.css";
import {
  CheckCircle, Clock, Wrench, Loader2, FileText,
  LogOut, Bell, Send, Activity, AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FIXED: Now properly used
  const [noteDrafts, setNoteDrafts] = useState({});

  // Notification state
  const [notifyConsumer, setNotifyConsumer] = useState("");
  const [notifyType, setNotifyType] = useState("issue");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyStatus, setNotifyStatus] = useState("");
  const [isBroadcast, setIsBroadcast] = useState(false);

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // FETCH ISSUES
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/issues");
      const data = await res.json();
      setIssues(data);

      // ✅ Initialize notes from backend
      const initialNotes = {};
      data.forEach(issue => {
        initialNotes[issue.id] = issue.technician_note || "";
      });
      setNoteDrafts(initialNotes);

    } catch (err) {
      setError("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          technician_note: noteDrafts[id] || ""
        })
      });

      setIssues(prev =>
        prev.map(issue =>
          issue.id === id
            ? {
                ...issue,
                status,
                technician_note: noteDrafts[id] || issue.technician_note
              }
            : issue
        )
      );
    } catch {
      alert("Failed to update issue");
    }
  };

  // SEND NOTIFICATION
  const sendNotification = async () => {
    if (!notifyMessage || (!isBroadcast && !notifyConsumer)) {
      setNotifyStatus("Please fill required fields");
      return;
    }

    const url = isBroadcast
      ? "http://127.0.0.1:5000/api/notifications/broadcast"
      : "http://127.0.0.1:5000/api/notifications";

    const payload = isBroadcast
      ? { title: "Maintenance Alert", message: notifyMessage, type: notifyType }
      : {
          consumer_no: notifyConsumer,
          title: "Technician Update",
          message: notifyMessage,
          type: notifyType
        };

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setNotifyStatus(
        isBroadcast
          ? "Broadcast sent to all consumers"
          : "Notification sent successfully"
      );

      setNotifyMessage("");
      setNotifyConsumer("");
      setIsBroadcast(false);

      setTimeout(() => setNotifyStatus(""), 3000);
    } catch {
      setNotifyStatus("Failed to send notification");
    }
  };

  return (
    <div className="technician-container">
      {/* HEADER */}
      <header className="tech-header">
        <div className="header-left">
          <h1>Technician Dashboard</h1>
          <p>Live consumer issue monitoring & resolution portal</p>
        </div>
        <button className="tech-logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* STATS */}
      <div className="tech-stats">
        <div className="stat-card total">
          <h4>Total Issues</h4>
          <p>{issues.length}</p>
        </div>
        <div className="stat-card warning">
          <h4>Pending</h4>
          <p>{issues.filter(i => i.status === "Pending").length}</p>
        </div>
        <div className="stat-card info">
          <h4>In Progress</h4>
          <p>{issues.filter(i => i.status === "In Progress").length}</p>
        </div>
        <div className="stat-card success">
          <h4>Resolved</h4>
          <p>{issues.filter(i => i.status === "Resolved").length}</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">

        {/* ISSUES TABLE */}
        <section className="issue-section">
          <h2>
            <FileText size={20} className="text-blue-400" />
            Reported Issues
          </h2>

          {loading ? (
            <div className="loading">
              <Loader2 className="spin" /> Loading issues...
            </div>
          ) : error ? (
            <p className="error">{error}</p>
          ) : issues.length === 0 ? (
            <p className="muted">No issues reported yet.</p>
          ) : (
            <table className="issue-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Notes</th> {/* ✅ NEW */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue.id}>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Activity size={14} /> {issue.category}
                      </div>
                    </td>

                    <td>{issue.location}</td>

                    <td>
                      <span className={`badge ${issue.urgency}`}>
                        {issue.urgency}
                      </span>
                    </td>

                    <td>
                      <span className={`status ${issue.status.replace(" ", "-")}`}>
                        {issue.status === "Resolved" && <CheckCircle size={14} />}
                        {issue.status === "In Progress" && <Wrench size={14} />}
                        {issue.status === "Pending" && <AlertCircle size={14} />}
                        {issue.status}
                      </span>
                    </td>

                    {/* ✅ NEW: Notes Input */}
                    <td>
                      <input
                        type="text"
                        className="note-input"
                        placeholder="Add note..."
                        value={noteDrafts[issue.id] || ""}
                        onChange={(e) =>
                          setNoteDrafts(prev => ({
                            ...prev,
                            [issue.id]: e.target.value
                          }))
                        }
                      />
                    </td>

                    <td className="actions">
                      <button onClick={() => updateStatus(issue.id, "In Progress")}>
                        <Wrench size={18} />
                      </button>
                      <button onClick={() => updateStatus(issue.id, "Resolved")}>
                        <CheckCircle size={18} />
                      </button>
                      <button onClick={() => updateStatus(issue.id, "Pending")}>
                        <Clock size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* NOTIFICATION PANEL */}
        <section className="notify-panel">
          <h2>
            <Bell size={18} /> Quick Notify
          </h2>

          <div className="notify-form">
            <select value={notifyType} onChange={(e) => setNotifyType(e.target.value)}>
              <option value="issue">Issue Update</option>
              <option value="maintenance">Maintenance Alert</option>
              <option value="bill">Bill Reminder</option>
            </select>

            <input
              type="text"
              placeholder="Consumer ID"
              disabled={isBroadcast}
              value={notifyConsumer}
              onChange={(e) => setNotifyConsumer(e.target.value)}
            />

            <textarea
              placeholder="Type message..."
              value={notifyMessage}
              onChange={(e) => setNotifyMessage(e.target.value)}
            />

            <label>
              <input
                type="checkbox"
                checked={isBroadcast}
                onChange={(e) => setIsBroadcast(e.target.checked)}
              />
              Broadcast
            </label>

            <button className="send-btn" onClick={sendNotification}>
              <Send size={16} /> Send
            </button>

            {notifyStatus && <p className="success-msg">{notifyStatus}</p>}
          </div>
        </section>

      </div>
    </div>
  );
}