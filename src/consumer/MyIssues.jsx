import React, { useEffect, useState } from "react";
import "./ConsumerDashboard.css";

export default function MyIssues() {
  const [issues, setIssues] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/issues/consumer/${user.consumer_no}`)
      .then(res => res.json())
      .then(data => setIssues(data));
  }, []);

  return (
    <div className="card">
      <h3>My Reported Issues</h3>

      {issues.length === 0 ? (
        <p>No issues reported yet.</p>
      ) : (
        issues.map(issue => (
          <div key={issue.id} className="issue-item">
            <p><strong>Category:</strong> {issue.category}</p>
            <p><strong>Status:</strong> {issue.status}</p>
            <p><strong>Urgency:</strong> {issue.urgency}</p>
            <p><strong>Technician Note:</strong> {issue.technician_note || "—"}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}
