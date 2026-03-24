import React, { useEffect, useState } from "react";
import "./ConsumerDashboard.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  LogOut,
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Bell,
  Server,
  MessageSquare,
  CreditCard,
  History   // ✅ NEW ICON
} from "lucide-react";

import ChatBot from "./ChatBot";
import BillPayment from "./BillPayment";
import Notifications from "./Notifications";

export default function ConsumerDashboard() {

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [issues, setIssues] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [paymentStatus, setPaymentStatus] = useState("Loading...");

  const user = JSON.parse(localStorage.getItem("user"));
  const consumerName = user?.name || "Consumer";
  const consumerNo = user?.consumer_no || "N/A";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ================= FETCH ISSUES =================
  useEffect(() => {
    if (!consumerNo || consumerNo === "N/A") return;

    fetch(`http://localhost:5000/api/issues/consumer/${consumerNo}`)
      .then((res) => res.json())
      .then((data) => setIssues(data))
      .catch((err) => console.error("Failed to fetch issues", err));
  }, [consumerNo]);

  // ================= FETCH NOTIFICATIONS =================
  useEffect(() => {
    if (!consumerNo || consumerNo === "N/A") return;

    fetch(`http://localhost:5000/api/notifications/${consumerNo}`)
      .then((res) => res.json())
      .then((data) => {
        const unread = data.filter((n) => !n.is_read).length;
        setUnreadCount(unread);
      })
      .catch(() => setUnreadCount(0));
  }, [consumerNo, showNotifications]);

  // ================= FETCH PAYMENT STATUS =================
  useEffect(() => {
    if (!consumerNo || consumerNo === "N/A") return;

    fetch(`http://localhost:5000/api/payment/${consumerNo}`)
      .then((res) => res.json())
      .then((data) => setPaymentStatus(data.status))
      .catch(() => setPaymentStatus("Unpaid"));
  }, [consumerNo]);

  return (
    <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>

      {collapsed && (
        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(false)}
        >
          ☰
        </button>
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div
          className="logo-area"
          onClick={() => setCollapsed(true)}
        >
          <Zap size={24} />
          {!collapsed && <span>SmartGrid</span>}
        </div>

        <nav className="nav-links">

          <div className="nav-item active">
            <LayoutDashboard size={20} />
            {!collapsed && <span>Dashboard</span>}
          </div>

          <div
            className="nav-item"
            onClick={() => navigate("/consumer/report")}
          >
            <AlertTriangle size={20} />
            {!collapsed && <span>Report Issue</span>}
          </div>

          <div
            className="nav-item"
            onClick={() => navigate("/consumer/payment")}
          >
            <CreditCard size={20} />
            {!collapsed && <span>Pay Bill</span>}
          </div>

          {/* ✅ NEW PAYMENT HISTORY BUTTON */}
          <div
            className="nav-item"
            onClick={() => navigate("/consumer/history")}
          >
            <History size={20} />
            {!collapsed && <span>Payment History</span>}
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
            <h2>Dashboard</h2>
            <p className="muted">Real-time power monitoring</p>
          </div>

          <div className="user-profile">

            <div
              className="notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>

            <div className="avatar">
              {consumerName.charAt(0).toUpperCase()}
            </div>

          </div>
        </header>

        {showNotifications && (
          <Notifications
            consumerNo={consumerNo}
            onClose={() => setShowNotifications(false)}
          />
        )}

        <motion.section
          className="welcome-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="welcome-text">
            <h1>Welcome back, {consumerName}</h1>
            <p>Consumer ID: {consumerNo}</p>
          </div>

          <span className={`status-badge ${paymentStatus === "Paid" ? "paid" : "unpaid"}`}>
            {paymentStatus === "Paid" ? "✅ Paid" : "❌ Unpaid"}
          </span>
        </motion.section>

        <section className="dashboard-grid">

          <div className="card">
            <h3><FileText size={18} /> Current Bill</h3>
            <BillPayment />

            <button
              className="pay-bill-btn"
              onClick={() => navigate("/consumer/payment")}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Pay Bill
            </button>
          </div>

          <div className="card">
            <h3><Server size={18} /> Supply Infrastructure</h3>

            <div className="info-row">
              <span>Transformer</span>
              <span>TX-204</span>
            </div>

            <div className="info-row">
              <span>Electric Post</span>
              <span>EP-18</span>
            </div>

            <div className="info-row">
              <span>Status</span>
              <span>Active</span>
            </div>
          </div>

          <div className="card">
            <h3><MessageSquare size={18} /> My Issues</h3>

            {issues.length === 0 ? (
              <p>No issues reported</p>
            ) : (
              issues.map((issue) => (
                <div key={issue.id}>
                  <p>{issue.category}</p>
                  <p>{issue.status}</p>
                  <hr />
                </div>
              ))
            )}
          </div>

        </section>

      </main>

      <ChatBot />
    </div>
  );
}