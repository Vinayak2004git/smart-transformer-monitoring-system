import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./authService";
import "./Login.css";

export default function Login() {
  const [loginType, setLoginType] = useState("consumer");
  const [email, setEmail] = useState("");
  const [consumerNo, setConsumerNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {

      // ✅ ADMIN LOGIN (NO CHANGE)
      if (email === "nandhu@gmail.com" && password === "nandhu123") {
        localStorage.setItem("user", JSON.stringify({
          role: "admin",
          name: "Admin"
        }));
        navigate("/admin/dashboard");
        return;
      }

      const payload =
        loginType === "consumer"
          ? { consumer_no: consumerNo, password }
          : { email, password };

      const data = await loginUser(payload);

      // ✅ STORE SESSION
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ UPDATED REDIRECTION (ONLY CHANGE)
      if (data.user.role === "consumer") {
        navigate("/consumer/dashboard");
      } else {
        navigate("/technician/home"); // 🔥 CHANGED HERE
      }

    } catch {
      alert("Invalid login credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue</p>

        {/* LOGIN TYPE */}
        <div className="select-group">
          <select
            value={loginType}
            onChange={e => setLoginType(e.target.value)}
          >
            <option value="consumer">Consumer Login</option>
            <option value="technician">Technician Login</option>
          </select>
        </div>

        {/* CONSUMER LOGIN */}
        {loginType === "consumer" && (
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

        {/* TECHNICIAN LOGIN */}
        {loginType === "technician" && (
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <label>Email Address</label>
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
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="register-text">
          New user?
          <span onClick={() => navigate("/register")}> Create account</span>
        </p>
      </form>
    </div>
  );
}