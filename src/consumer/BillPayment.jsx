import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BillPayment() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // User Data
  const consumerName = user?.name || "Consumer";
  const consumerId = user?.consumer_no || "C001";
  
  // State Management
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false); // Track payment status

  const processPayment = async () => {
    setLoading(true);
    
    // Simulate API Latency
    setTimeout(async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            consumer_no: consumerId,
            amount: 1250
          })
        });

        if (!res.ok) throw new Error("Payment failed");

        // Success Logic
        setIsPaid(true); 
        setLoading(false);
        setShowModal(false);
      } catch (error) {
        console.error(error);
        alert("❌ Connection Error: Ensure backend is running.");
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div style={container}>
      <div style={card}>
        {!isPaid ? (
          <>
            <h2 style={{ marginBottom: "10px" }}>⚡ Electricity Bill</h2>
            <p style={label}>Account Holder</p>
            <p style={value}>{consumerName}</p>
            
            <p style={label}>Consumer ID</p>
            <p style={value}>{consumerId}</p>

            <div style={divider} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Total Amount:</span>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#60a5fa" }}>₹1,250.00</span>
            </div>

            <button onClick={() => setShowModal(true)} style={payBtn}>
              Proceed to Pay
            </button>
            <button onClick={() => navigate("/consumer/dashboard")} style={backBtn}>
              Back to Dashboard
            </button>
          </>
        ) : (
          /* SUCCESS VIEW */
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={successIcon}>✓</div>
            <h2 style={{ color: "#4ade80" }}>Payment Successful!</h2>
            <p style={{ opacity: 0.8, marginBottom: "20px" }}>
              Transaction ID: #PAY-{Math.floor(Math.random() * 1000000)}
            </p>
            <div style={receiptBox}>
              <p>Amount Paid: <strong>₹1,250.00</strong></p>
              <p>Status: <strong>Confirmed</strong></p>
            </div>
            <button onClick={() => navigate("/consumer/dashboard")} style={payBtn}>
              Return to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={modalBg}>
          <div style={modalBox}>
            <h3 style={{ marginTop: 0 }}>Secure Checkout</h3>
            <p style={{ fontSize: "14px", color: "#64748b" }}>Payable Amount: ₹1,250</p>
            
            <input placeholder="Card Number" style={inputStyle} maxLength="16" />
            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="MM/YY" style={inputStyle} />
              <input placeholder="CVV" type="password" style={inputStyle} maxLength="3" />
            </div>

            <button onClick={processPayment} disabled={loading} style={payBtn}>
              {loading ? "Authorizing..." : "Pay Now"}
            </button>
            <button onClick={() => setShowModal(false)} style={cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* UPDATED STYLES */
const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Segoe UI', Roboto, sans-serif"
};

const card = {
  width: "400px",
  background: "#1e293b",
  padding: "30px",
  borderRadius: "16px",
  color: "#fff",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
  border: "1px solid #334155"
};

const label = { fontSize: "12px", color: "#94a3b8", marginBottom: "4px", textTransform: "uppercase" };
const value = { fontSize: "16px", marginBottom: "15px", fontWeight: "500" };
const divider = { height: "1px", background: "#334155", margin: "20px 0" };

const payBtn = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  background: "#2563eb",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background 0.2s"
};

const backBtn = {
  width: "100%",
  marginTop: "10px",
  background: "transparent",
  border: "1px solid #475569",
  borderRadius: "8px",
  color: "#94a3b8",
  padding: "10px",
  cursor: "pointer"
};

const successIcon = {
  width: "60px",
  height: "60px",
  background: "#16a34a",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  margin: "0 auto 20px"
};

const receiptBox = {
  background: "#0f172a",
  padding: "15px",
  borderRadius: "8px",
  fontSize: "14px",
  textAlign: "left"
};

const modalBg = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backdropFilter: "blur(4px)"
};

const modalBox = {
  width: "360px",
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  color: "#1e293b"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  boxSizing: "border-box"
};

const cancelBtn = {
  width: "100%",
  marginTop: "10px",
  padding: "10px",
  background: "none",
  border: "none",
  color: "#64748b",
  cursor: "pointer"
};