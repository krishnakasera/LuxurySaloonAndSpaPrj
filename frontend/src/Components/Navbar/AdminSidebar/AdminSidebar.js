import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin-login");
  };

  return (
    <aside className="admin-sidebar">

      {/* Logo */}
      <div className="admin-logo">
        <h2>Luxury Salon</h2>
        <span>ADMIN PANEL</span>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">

        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/admin-appointments"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          📅 Appointments
        </NavLink>

        <NavLink
          to="/admin-customers"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          👥 Customers
        </NavLink>

        <NavLink
          to="/admin-services"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          💇 Services
        </NavLink>

      </nav>

      {/* Bottom */}
      <div className="admin-sidebar-bottom">

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;