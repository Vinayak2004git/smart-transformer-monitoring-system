import { motion } from "framer-motion";

export default function ReportIssue() {
  return (
    <motion.div
      className="report-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3>Report Issue / Emergency</h3>
      <p className="report-subtext">
        Report power-related issues directly to the technical team.
      </p>

      {/* Issue Type */}
      <div className="form-group">
        <label>Issue Category</label>
        <select className="input">
          <option value="">Select issue type</option>
          <option>Power Outage</option>
          <option>Voltage Fluctuation</option>
          <option>Electric Post Damage</option>
          <option>Transformer Issue</option>
          <option>Emergency</option>
        </select>
      </div>

      {/* Description */}
      <div className="form-group">
        <label>Description (Optional)</label>
        <textarea
          className="input textarea"
          placeholder="Briefly describe the issue..."
        />
      </div>

      {/* Attachment */}
      <div className="form-group">
        <label>Attach Image / PDF (Optional)</label>
        <input
          type="file"
          className="file-input"
          accept=".jpg,.jpeg,.png,.pdf"
        />
        <small className="hint">
          Supported formats: JPG, PNG, PDF (Max 5MB)
        </small>
      </div>

      {/* Submit */}
      <button className="action-btn danger">
        Submit Report
      </button>
    </motion.div>
  );
}
