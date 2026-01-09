import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./authService";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await registerUser({ name, email, password, role });
      alert("Registration successful. Please login.");
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      <input placeholder="Full Name" onChange={e => setName(e.target.value)} required />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />

      <select onChange={e => setRole(e.target.value)} required>
        <option value="">Select Role</option>
        <option value="consumer">Consumer</option>
        <option value="technician">Technician</option>
      </select>

      <button type="submit">Register</button>
    </form>
  );
}
