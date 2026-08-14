import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Gallery from "./Pages/Gallery";
import Navbar from "./Components/Navbar";
import Offers from "./Pages/Offers";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Appointment from "./Pages/Appointment";
import MyAppointments from "./Pages/MyAppointment";
import Profile from "./Pages/Profile";

// ================= ADMIN =================

import AdminLogin from "./Pages/AdminLogin/index";
import AdminDashboard from "./Pages/AdminPages/AdminDashboard";
import AdminAppointments from "./Pages/AdminAppointment/AdminAppointment";
import AdminProtectedRoute from "./Components/Navbar/AdminProtectionRoutes";
import AdminCustomers from "./Pages/AdminCustmor/AdminCustomers";
import AdminServices from "./Pages/AdminServices/AdminServices";

function App() {
  const location = useLocation();

  // Hide customer Navbar on all admin pages
  const isAdminPage =
    location.pathname.startsWith("/admin");

  return (
    <>
      {/* ================= CUSTOMER NAVBAR ================= */}

      {!isAdminPage && <Navbar />}

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ================= MAIN PAGES ================= */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/offers"
          element={<Offers />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ================= CUSTOMER AUTH ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= APPOINTMENT ================= */}

        <Route
          path="/appointment"
          element={<Appointment />}
        />

        <Route
          path="/my-appointments"
          element={<MyAppointments />}
        />

        {/* ================= PROFILE ================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* ================= ADMIN LOGIN ================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* ================= ADMIN DASHBOARD ================= */}

        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* ================= ADMIN APPOINTMENTS ================= */}

        <Route
          path="/admin-appointments"
          element={
            <AdminProtectedRoute>
              <AdminAppointments />
            </AdminProtectedRoute>
          }
        />

        {/* ================= ADMIN CUSTOMERS ================= */}
         <Route
  path="/admin-customers"
  element={
    <AdminProtectedRoute>
      <AdminCustomers />
    </AdminProtectedRoute>
  }
/>
        {/* ================= ADMIN SERVICES ================= */}
        <Route
  path="/admin-services"
  element={<AdminServices />}
/>

      </Routes>
    </>
  );
}

export default App;