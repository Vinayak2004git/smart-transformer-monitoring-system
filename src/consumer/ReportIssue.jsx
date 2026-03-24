// src/consumer/ReportIssue.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  AlertTriangle,
  LogOut,
  MapPin,
  CheckCircle,
  Loader2,
  FileText
} from "lucide-react";
import "./ConsumerDashboard.css";

export default function ReportIssue() {
  const navigate = useNavigate();

  // Get logged-in consumer
  const user = JSON.parse(localStorage.getItem("user"));
  const consumerNo = user?.consumer_no;

  // Sidebar
  const [collapsed, setCollapsed] = useState(false);

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    category: "",
    urgency: "medium",
    location: "",
    description: ""
  });

  // ---------------- HANDLERS ----------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- SUBMIT TO BACKEND ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!consumerNo) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          consumer_no: consumerNo,
          category: formData.category,
          urgency: formData.urgency,
          location: formData.location,
          description: formData.description
        })
      });

      // ✅ Backend returns 201 for success
      if (response.status !== 201) {
        throw new Error("Issue submission failed");
      }

      const data = await response.json();

      // ✅ SAFE: issue or id may be missing
      setTicketId(data?.issue?.id || "Generated");
      setIsSuccess(true);

    } catch (error) {
      console.error(error);
      alert("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- SUCCESS SCREEN ----------------
  if (isSuccess) {
    return (
      <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>

        <aside className="sidebar">
          <div className="logo-area">
            <Zap size={22} />
            <span>SmartGrid</span>
          </div>
        </aside>

        <main className="main-content centered-content">
          <div className="success-card">
            <CheckCircle size={64} color="#10b981" />
            <h2>Issue Reported Successfully</h2>
            <p><strong>Ticket ID:</strong> {ticketId}</p>
            <p className="muted">Our technical team has received your request.</p>

            <button
              className="action-btn primary"
              onClick={() => navigate("/consumer/dashboard")}
            >
              Back to Dashboard
            </button>

            <button
              className="text-link"
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  category: "",
                  urgency: "medium",
                  location: "",
                  description: ""
                });
              }}
            >
              Report Another Issue
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ---------------- MAIN PAGE ----------------
  return (
    <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-area" onClick={() => setCollapsed(!collapsed)}>
          <Zap size={22} />
          {!collapsed && <span>SmartGrid</span>}
        </div>

        <nav className="nav-links">
          <div className="nav-item" onClick={() => navigate("/consumer/dashboard")}>
            <LayoutDashboard size={20} />
            {!collapsed && <span>Dashboard</span>}
          </div>

          <div className="nav-item active">
            <AlertTriangle size={20} />
            {!collapsed && <span>Report Issue</span>}
          </div>
        </nav>

        <div className="nav-item logout" onClick={handleLogout}>
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>Report a Grid Issue</h2>
            <p className="muted">Submit a problem to the maintenance team</p>
          </div>
        </header>

        <div className="report-layout">

          <section className="card form-card">
            <div className="card-header">
              <h3><FileText size={18} /> Issue Details</h3>
            </div>

            <form onSubmit={handleSubmit} className="report-form">

              <div className="form-row">
                <div className="form-group">
                  <label>Issue Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="outage">Power Outage</option>
                    <option value="fluctuation">Voltage Fluctuation</option>
                    <option value="damage">Equipment Damage</option>
                    <option value="billing">Meter / Billing Fault</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Urgency</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <div className="input-with-icon">
                  <MapPin size={18} className="field-icon" />
                  <input
                    type="text"
                    name="location"
                    className="input has-icon"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="input textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="action-btn secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="action-btn primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Ticket"
                  )}
                </button>
              </div>

            </form>
          </section>

          <aside className="info-panel">
            <div className="card info-card">
              <h4>Emergency Notice</h4>
              <p>Stay away from sparks, fire, or fallen power lines.</p>
              <div className="emergency-box">📞 1800-GRID-HELP</div>
            </div>

            <div className="card info-card">
              <h4>Response Time</h4>
              <ul className="info-list">
                <li><strong>High:</strong> &lt; 2 hours</li>
                <li><strong>Medium:</strong> 24–48 hours</li>
                <li><strong>Low:</strong> 3–5 days</li>
              </ul>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
