
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const profileImage =
    localStorage.getItem("profileImage") ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <nav className="navbar">

      {/* ================= LOGO ================= */}
      <div className="logo">
        <NavLink to="/" className="logo-link">
          <span className="logo-icon">✦</span>

          <div className="logo-text">
            <span className="logo-main">LUXURY</span>
            <span className="logo-sub">SALON & SPA</span>
          </div>
        </NavLink>
      </div>

      {/* ================= NAVIGATION LINKS ================= */}
      <ul className="nav-links">

        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        <li>
          <NavLink to="/about">About</NavLink>
        </li>

        <li>
          <NavLink to="/services">Services</NavLink>
        </li>

        <li>
          <NavLink to="/gallery">Gallery</NavLink>
        </li>

        <li>
          <NavLink to="/offers">Offers</NavLink>
        </li>

        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>

        <li>
          <NavLink to="/my-appointments">
            My Appointments
          </NavLink>
        </li>

      </ul>

      {/* ================= AUTH BUTTONS ================= */}
      <div className="auth-buttons">

        <NavLink
          to="/login"
          className="login-btn"
        >
          Login
        </NavLink>

        <NavLink
          to="/register"
          className="register-btn"
        >
          Register
        </NavLink>

        <NavLink
          to="/profile"
          className="profile-navbar"
        >
          <img
            src={profileImage}
            alt="Profile"
          />
        </NavLink>

      </div>

    </nav>
  );
};

export default Navbar;

