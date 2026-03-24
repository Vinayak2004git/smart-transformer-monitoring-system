import React, { useEffect, useState } from "react";
import "./ConsumerDashboard.css"; // reuse existing styles

export default function Notifications({ consumerNo, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH NOTIFICATIONS =================
  useEffect(() => {
    if (!consumerNo) return;

    fetch(`http://localhost:5000/api/notifications/${consumerNo}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [consumerNo]);

  // ================= MARK AS READ =================
  const markAsRead = (id) => {
    fetch(`http://localhost:5000/api/notifications/${id}/read`, {
      method: "PATCH",
    })
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          )
        );
      })
      .catch((err) => console.error("Failed to mark as read", err));
  };

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h4>Notifications</h4>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {loading ? (
        <p className="muted">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="muted">No notifications yet.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`notification-item ${n.is_read ? "read" : "unread"}`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="notification-title">
                <strong>{n.title}</strong>
                <span className={`type-badge ${n.type}`}>
                  {n.type}
                </span>
              </div>

              <p className="notification-message">{n.message}</p>

              <span className="notification-time">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
