import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./authService";
import "./Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consumerNo, setConsumerNo] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        consumer_no: role === "consumer" ? consumerNo : null
      };

      await registerUser(payload);

      alert("Registration successful. Please login.");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleRegister}>
        <h2>Create Account</h2>
        <p className="subtitle">Join the smart monitoring system</p>

        {/* NAME */}
        <div className="input-group">
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <label>Full Name</label>
        </div>

        {/* EMAIL */}
        <div className="input-group">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <label>Email Address</label>
        </div>

        {/* ROLE */}
        <div className="select-group">
          <select
            required
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="consumer">Consumer</option>
            <option value="technician">Technician</option>
          </select>
        </div>

        {/* CONSUMER NUMBER (ONLY FOR CONSUMER) */}
        {role === "consumer" && (
          <div className="input-group">
            <input
              type="text"
              required
              value={consumerNo}
              onChange={e => setConsumerNo(e.target.value)}
            />
            <label>Consumer Number</label>
          </div>
        )}

        {/* PASSWORD */}
        <div className="input-group">
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="login-text">
          Already have an account?
          <span onClick={() => navigate("/")}> Login</span>
        </p>
      </form>
    </div>
  );
}
