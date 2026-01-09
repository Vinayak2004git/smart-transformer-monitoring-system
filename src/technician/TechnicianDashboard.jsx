import React from 'react';
import "./TechnicianDashboard.css";


export default function TechnicianDashboard({ data = {} }) {
  return (
    <div className="technician-dashboard">
      {/* ALERT BAR */}
      <div className="alert-bar">
        <span>⚠ Critical Alert: Voltage fluctuation detected. TR-089 requires immediate attention!</span>
        <button>Take Action</button>
      </div>

      {/* HEADER */}
      <div className="header">
        <h1>Technician Dashboard</h1>
        <p>Real-time monitoring and control of distribution transformers</p>
      </div>

      {/* STAT CARDS */}
      <div className="stats">
        <div className="card">
          <h4>Active Transformers</h4>
          <p>{data.active_transformers}</p>
        </div>
        <div className="card">
          <h4>Total Load</h4>
          <p>{data.total_load} kW</p>
        </div>
        <div className="card warning">
          <h4>Active Faults</h4>
          <p>{data.active_faults}</p>
        </div>
        <div className="card success">
          <h4>System Health</h4>
          <p>{data.system_health}%</p>
        </div>
      </div>

      {/* TRANSFORMER MAP */}
      <div className="map-section">
        <h3>Transformer Distribution Map</h3>

        <div className="map">
          <div className="transformer normal" title="TR-101 | Load: 2100kW | Last Maint: Jan 2026">TR-101</div>
          <div className="transformer warning" title="TR-205 | Load: 3200kW | Last Maint: Dec 2025">TR-205</div>
          <div className="transformer critical" title="TR-089 | Load: 2800kW | Last Maint: Nov 2025">TR-089</div>
          <div className="transformer normal" title="TR-112 | Load: 1500kW | Last Maint: Jan 2026">TR-112</div>
          <div className="transformer maintenance" title="TR-334 | Load: 2000kW | Last Maint: Scheduled Feb 2026">TR-334</div>
        </div>

        <div className="legend">
          <span className="normal">Normal</span>
          <span className="warning">Warning</span>
          <span className="critical">Critical</span>
          <span className="maintenance">Maintenance</span>
        </div>
      </div>
    </div>
  );
}