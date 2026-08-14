import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          email,
          password,
        }
      );

      // Save admin token
      localStorage.setItem(
        "adminToken",
        response.data.token
      );

      // Save admin information
      localStorage.setItem(
        "adminUser",
        JSON.stringify(response.data.user)
      );

      // Go to admin dashboard
      navigate("/admin-dashboard");

    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.response?.data?.message ||
          "Admin login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-icon">
          🔐
        </div>

        <h1>Admin Login</h1>

        <p className="admin-subtitle">
          Login to manage Luxury Salon & Spa
        </p>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Admin Login"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminLogin;