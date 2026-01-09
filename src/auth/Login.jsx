import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      if (data.role === "consumer") {
        localStorage.setItem("consumerNo", data.consumer_no);
        navigate("/consumer/dashboard");
      }

      if (data.role === "technician") {
        localStorage.setItem("technicianId", data.technician_id);
        navigate("/technician/dashboard");
      }

    } catch {
      alert("Invalid login credentials");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />

      <button type="submit">Login</button>
      <p onClick={() => navigate("/register")} style={{cursor:"pointer"}}>
        New user? Register
      </p>
    </form>
  );
}
