import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  // Get user from localStorage
  const userString = localStorage.getItem("user");

  let user = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("User data error:", error);
  }

  const profileImage =
    localStorage.getItem("profileImage") ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">

          <img
            className="profile-avatar"
            src={profileImage}
            alt="Profile"
          />

          <h2>Welcome to Luxury Salon & Spa</h2>

          <p>Please login to view your profile.</p>

          <button
            onClick={() => navigate("/login")}
            className="profile-btn"
          >
            Login
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // LOGGED IN
  // =========================

  return (
    <div className="profile-container">

      <div className="profile-card">

        {/* Profile Image */}

        <img
          className="profile-avatar"
          src={profileImage}
          alt="Profile"
        />

        {/* Name */}

        <h1>
          {user.name || "Customer"}
        </h1>

        <p className="customer-role">
          Customer
        </p>

        {/* User Details */}

        <div className="profile-details">

          <div className="profile-row">
            <strong>Email</strong>
            <span>
              {user.email || "Not available"}
            </span>
          </div>

          <div className="profile-row">
            <strong>Phone</strong>
            <span>
              {user.phone ||
                user.contact ||
                "Not available"}
            </span>
          </div>

          <div className="profile-row">
            <strong>Address</strong>
            <span>
              {user.address ||
                user.location ||
                "Not available"}
            </span>
          </div>

        </div>

        {/* My Appointments */}

        <button
          className="profile-btn"
          onClick={() =>
            navigate("/myappointments")
          }
        >
          My Appointments
        </button>

        {/* Logout */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default Profile;