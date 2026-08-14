import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        user
      );

      console.log("Login successful:", response.data);

      // Save JWT token if backend sends it
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Save logged-in user
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      setMessage("Login successful!");

      // Go to Home page after successful login
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);

      console.log("Status:", error.response?.status);
      console.log("Backend response:", error.response?.data);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;