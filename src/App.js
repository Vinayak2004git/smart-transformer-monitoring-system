import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminDashboard from "./admin/AdminDashboard";
import ConsumerDashboard from "./consumer/ConsumerDashboard";
import ReportIssue from "./consumer/ReportIssue";
import BillPayment from "./consumer/BillPayment";   // ✅ Import payment page
import TechnicianHome from "./technician/TechnicianHome";
import TechnicianDashboard from "./technician/TechnicianDashboard";
import PaymentHistory from "./consumer/PaymentHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/consumer/history" element={<PaymentHistory />} />
        <Route path="/technician/home" element={<TechnicianHome />} />
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />

       {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Consumer */}
        <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
        <Route path="/consumer/report" element={<ReportIssue />} />
        <Route path="/consumer/payment" element={<BillPayment />} />  {/* ✅ Payment route */}

        {/* Technician */}
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
       <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;