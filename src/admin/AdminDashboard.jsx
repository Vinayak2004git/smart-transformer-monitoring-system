import React, { useEffect, useState } from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATE (area mapping)
  const [areas, setAreas] = useState({});
  const [processingId, setProcessingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTechs();
  }, []);

  const fetchTechs = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/technicians/pending");
      const data = await res.json();
      setTechs(data);
    } catch {
      alert("Failed to load technicians");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED APPROVE FUNCTION (send area)
  const approveTech = async (id) => {
    const area = areas[id];

    if (!area) {
      alert("Please assign area before approving");
      return;
    }

    setProcessingId(id);

    try {
      await fetch(`http://127.0.0.1:5000/api/technicians/approve/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ area }),
      });

      // remove approved tech
      setTechs(prev => prev.filter(t => t.id !== id));

      alert("✅ Technician approved & area assigned");
    } catch {
      alert("❌ Failed to approve");
    } finally {
      setProcessingId(null);
    }
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-layout">

      {/* 🔹 SIDEBAR */}
      <aside className="admin-sidebar">
        <h2>⚙️ Admin</h2>
        <p>Smart Grid System</p>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* 🔹 MAIN */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">
          <div>
            <h1>Technician Approval</h1>
            <p className="subtitle">Assign areas & manage technicians</p>
          </div>

          <span className="badge">{techs.length} Pending</span>
        </header>

        {/* CONTENT */}
        {loading ? (
          <p className="loading">Loading technicians...</p>
        ) : techs.length === 0 ? (
          <div className="empty">
            <h3>✅ All technicians approved</h3>
            <p>No pending approvals</p>
          </div>
        ) : (
          <div className="tech-grid">
            {techs.map((t) => (
              <div key={t.id} className="tech-card">

                <div className="tech-header">
                  <div className="avatar">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <h3>{t.name}</h3>
                </div>

                <p><strong>Email:</strong> {t.email}</p>
                <p><strong>ID:</strong> {t.technician_id}</p>

                {/* ✅ AREA INPUT */}
                <input
                  type="text"
                  placeholder="Assign Area (e.g. Zone A)"
                  value={areas[t.id] || ""}
                  onChange={(e) =>
                    setAreas({ ...areas, [t.id]: e.target.value })
                  }
                  className="area-input"
                />

                {/* ✅ APPROVE BUTTON */}
                <button
                  className="approve-btn"
                  onClick={() => approveTech(t.id)}
                  disabled={processingId === t.id}
                >
                  {processingId === t.id ? "Processing..." : "✔ Approve & Assign"}
                </button>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}