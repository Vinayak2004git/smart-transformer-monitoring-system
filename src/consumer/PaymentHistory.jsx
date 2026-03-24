import "./PaymentHistory.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import jsPDF from "jspdf"; // ✅ NEW
import { 
  ChevronLeft, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ReceiptText 
} from "lucide-react";

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const consumerNo = user?.consumer_no;

  useEffect(() => {
    if (!consumerNo) return;

    fetch(`http://localhost:5000/api/payments/${consumerNo}`)
      .then((res) => res.json())
      .then((data) => {
        setPayments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Payment fetch error:", err);
        setPayments([]);
      })
      .finally(() => setIsLoading(false));
  }, [consumerNo]);

  // ✅ DOWNLOAD FUNCTION
  const downloadReceipt = (payment) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Electricity Bill Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Transaction ID: ${payment.id}`, 20, 40);
    doc.text(`Consumer ID: ${consumerNo}`, 20, 50);
    doc.text(`Amount: ₹${payment.amount}`, 20, 60);
    doc.text(`Status: ${payment.status}`, 20, 70);
    doc.text(
      `Date: ${new Date(payment.created_at).toLocaleString()}`,
      20,
      80
    );

    doc.text("Thank you for your payment!", 20, 100);

    doc.save(`Receipt_${payment.id}.pdf`);
  };

  // Status Badge Helper
  const StatusBadge = ({ status }) => {
    const isSuccess = status?.toLowerCase() === "success" || status?.toLowerCase() === "paid";
    return (
      <span className={`status-pill ${isSuccess ? "success" : "pending"}`}>
        {isSuccess ? <CheckCircle2 size={12} /> : <Clock size={12} />}
        {status}
      </span>
    );
  };

  return (
    <div className="history-page-container">
      <motion.div 
        className="history-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >

        {/* HEADER */}
        <div className="history-header">
          <button className="back-link" onClick={() => navigate("/consumer/dashboard")}>
            <ChevronLeft size={18} /> Back to Dashboard
          </button>

          <div className="title-section">
            <div className="icon-box">
              <ReceiptText size={24} color="#6366f1" />
            </div>
            <div>
              <h2>Payment History</h2>
              <p className="subtitle">View and download your past transactions</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="history-body">
          {isLoading ? (
            <div className="skeleton-loader">Loading records...</div>
          ) : payments.length === 0 ? (
            <div className="empty-history">
              <AlertCircle size={40} className="muted-icon" />
              <p>No transaction history found for ID: {consumerNo}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>

                      <td className="date-cell">
                        {new Date(p.created_at).toLocaleDateString()}
                        <span className="time-stamp">
                          {new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* ✅ FIXED ID FORMAT */}
                      <td className="tx-id">#TXN-{p.id}</td>

                      <td className="amount-cell">
                        ₹{Number(p.amount).toLocaleString()}
                      </td>

                      <td>
                        <StatusBadge status={p.status} />
                      </td>

                      {/* ✅ DOWNLOAD BUTTON CONNECTED */}
                      <td>
                        <button
                          className="download-btn"
                          onClick={() => downloadReceipt(p)}
                          title="Download Receipt"
                        >
                          <Download size={16} />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}