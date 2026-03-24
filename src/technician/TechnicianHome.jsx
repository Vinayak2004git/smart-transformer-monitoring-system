import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Zap, Activity, Thermometer, ShieldCheck, 
  ArrowRight, MapPin, Radio, AlertCircle,
  FileBarChart, Download, History, ClipboardCheck
} from "lucide-react";
import "./TechnicianHome.css";

export default function TechnicianHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const name = user?.name || "Field Engineer";
  const area = user?.assigned_area || "Sector 7G - Industrial";

  // Mocked Log Data
  const reportLogs = [
    { id: "LOG-992", date: "2024-05-20", event: "Voltage Regularization", status: "Success", tech: name },
    { id: "LOG-991", date: "2024-05-19", event: "Transformer Oil Check", status: "Verified", tech: name },
    { id: "LOG-990", date: "2024-05-18", event: "Capacitor Bank Sync", status: "Success", tech: "System Auto" },
  ];

  const [telemetry] = useState({
    status: "Operational",
    temperature: 47,
    load: 68,
    uptime: "14d 6h"
  });

  return (
    <div className="sds-container">
      {/* ... HEADER & TELEMETRY SECTION (Same as before) ... */}
      <header className="sds-header">
        <div className="user-profile">
          <div className="avatar">{name.charAt(0)}</div>
          <div>
            <h1>{name}</h1>
            <p className="area-tag"><MapPin size={14} /> {area}</p>
          </div>
        </div>
        <div className="system-status">
          <Radio size={16} className="pulse-icon" />
          <span>Grid Sync: Active</span>
        </div>
      </header>

      <main className="sds-content">
        {/* TELEMETRY CARDS (Simplified for brevity) */}
        <section className="telemetry-section">
            {/* [Existing Telemetry Grid Code] */}
        </section>

        {/* NEW PROFESSIONAL REPORTING SECTION */}
        <section className="reporting-section">
          <div className="section-header">
            <div className="title-group">
              <History size={20} className="text-blue" />
              <h2>Area Operational Logs</h2>
            </div>
            <div className="action-group">
               <button className="export-btn" onClick={() => window.print()}>
                 <Download size={14} /> Export PDF
               </button>
               <button className="export-btn outline">
                 <FileBarChart size={14} /> Analytics
               </button>
            </div>
          </div>

          <div className="log-table-container">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Timestamp</th>
                  <th>Event Description</th>
                  <th>Outcome</th>
                  <th>Authorized By</th>
                </tr>
              </thead>
              <tbody>
                {reportLogs.map((log) => (
                  <tr key={log.id}>
                    <td><code className="log-id">{log.id}</code></td>
                    <td>{log.date}</td>
                    <td>{log.event}</td>
                    <td>
                      <span className="status-indicator">
                        <ClipboardCheck size={12} /> {log.status}
                      </span>
                    </td>
                    <td>{log.tech}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="action-grid">
          <button className="primary-action-btn" onClick={() => navigate("/technician/dashboard")}>
            <span>Initialize Fault Management Dashboard</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </main>

      <footer className="sds-footer">
        <p>VoltGuard Smart Distribution v4.2.0 | System Node: TX-402-B | Secure Field Session</p>
      </footer>
    </div>
  );
}