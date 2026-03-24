import React, { useState, useEffect, useRef } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I am SmartGrid Assistant. How can I help you manage your energy today?" }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply || "I'm sorry, I couldn't process that." };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "⚠️ System offline. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000, fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- Toggle Button --- */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={styles.launcher}
        >
          <span>💬</span>
        </button>
      )}

      {/* --- Chat Window --- */}
      {isOpen && (
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={styles.statusDot} />
              <h4 style={{ margin: 0, fontSize: "16px" }}>SmartGrid Assistant</h4>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>×</button>
          </div>

          {/* Messages Area */}
          <div style={styles.messageArea} ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                display: "flex", 
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "12px" 
              }}>
                <div style={{
                  ...styles.bubble,
                  backgroundColor: msg.sender === "user" ? "#2563eb" : "#334155",
                  borderRadius: msg.sender === "user" ? "15px 15px 2px 15px" : "15px 15px 15px 2px",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ color: "#94a3b8", fontSize: "12px", marginLeft: "5px" }}>Assistant is typing...</div>
            )}
          </div>

          {/* Input Area */}
          <div style={styles.inputContainer}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Professional Styling ---
const styles = {
  launcher: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "24px",
    boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s"
  },
  card: {
    width: "350px",
    height: "500px",
    backgroundColor: "#0f172a",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    overflow: "hidden",
    border: "1px solid #334155"
  },
  header: {
    padding: "15px 20px",
    backgroundColor: "#1e293b",
    borderBottom: "1px solid #334155",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    boxShadow: "0 0 8px #22c55e"
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "24px",
    cursor: "pointer"
  },
  messageArea: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    scrollbarWidth: "thin"
  },
  bubble: {
    maxWidth: "80%",
    padding: "10px 15px",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "white"
  },
  inputContainer: {
    padding: "15px",
    backgroundColor: "#1e293b",
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
    outline: "none",
    fontSize: "14px"
  },
  sendBtn: {
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: "8px",
    width: "40px",
    cursor: "pointer",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};