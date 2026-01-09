import "./ConsumerDashboard.css";
import { motion } from "framer-motion";
import BillPayment from "./BillPayment";
import Notifications from "./Notifications";
import ReportIssue from "./ReportIssue";

export default function ConsumerDashboard() {
  const consumerName =
    localStorage.getItem("consumerName") || "Nandhu Reji";
  const consumerNo =
    localStorage.getItem("consumerNo") || "CN-458921";

  const supplyStatus = "NORMAL";

  return (
    <div className="dashboard">

      {/* Top Navbar */}
      <motion.header
        className="topbar"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2>Smart Power Distribution Portal</h2>
        <button className="logout">Logout</button>
      </motion.header>

      {/* Welcome Section */}
      <motion.section
        className="welcome"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <h3>Welcome, {consumerName}</h3>
          <p>Consumer No: {consumerNo}</p>
        </div>

        <div className={`status-chip ${supplyStatus.toLowerCase()}`}>
          {supplyStatus === "NORMAL" && "Supply Stable"}
          {supplyStatus === "WARNING" && "Maintenance"}
          {supplyStatus === "FAULT" && "Power Outage"}
        </div>
      </motion.section>

      {/* Dashboard Cards */}
      <motion.section
        className="dashboard-grid"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <BillPayment />
        <Notifications />
        <div className="card">
          <h3>Supply Information</h3>
          <p>Transformer: TX-204</p>
          <p>Electric Post: EP-18</p>
          <p>Last Updated: 1 min ago</p>
        </div>
      </motion.section>

      {/* Report Section */}
      <motion.section
        className="report-section"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <ReportIssue />
      </motion.section>

    </div>
  );
}
