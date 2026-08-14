import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

import AdminSidebar from "../../Components/Navbar/AdminSidebar/AdminSidebar";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  // =====================================
  // FETCH ALL APPOINTMENTS
  // =====================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Admin login required.");
        setAppointments([]);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Appointments response:", response.data);

      // Backend returns:
      // { appointments: [...] }

      if (Array.isArray(response.data.appointments)) {
        setAppointments(response.data.appointments);
      } else {
        setAppointments([]);
        setError("Invalid appointment data received.");
      }
    } catch (error) {
      console.error("Fetch appointments error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        setError("Session expired. Please login again.");
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to load appointments."
        );
      }

      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD APPOINTMENTS
  // =====================================

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =====================================
  // UPDATE APPOINTMENT STATUS
  // =====================================

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/appointments/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment status updated successfully.");

      fetchAppointments();
    } catch (error) {
      console.error("Update status error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update appointment status."
      );
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "/admin-login";
  };

  // =====================================
  // STATISTICS
  // =====================================

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "Confirmed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "Cancelled"
  ).length;

  // =====================================
  // DASHBOARD UI
  // =====================================

  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}

      <AdminSidebar />

      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-main">

        <div className="admin-dashboard">

          {/* ================= HEADER ================= */}

          <header className="admin-header">

            <div>
              <h1>Admin Dashboard</h1>

              <p>
                Manage Luxury Salon & Spa appointments
              </p>
            </div>

            {/* Keep logout here for now */}
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </header>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* ================= STATISTICS ================= */}

          <section className="stats-container">

            <div className="stat-card">
              <h3>Total Appointments</h3>
              <span>{totalAppointments}</span>
            </div>

            <div className="stat-card pending">
              <h3>Pending</h3>
              <span>{pendingAppointments}</span>
            </div>

            <div className="stat-card confirmed">
              <h3>Confirmed</h3>
              <span>{confirmedAppointments}</span>
            </div>

            <div className="stat-card cancelled">
              <h3>Cancelled</h3>
              <span>{cancelledAppointments}</span>
            </div>

          </section>

          {/* ================= APPOINTMENTS ================= */}

          <section className="appointments-section">

            <div className="section-header">

              <h2>All Appointments</h2>

              <button
                className="refresh-btn"
                onClick={fetchAppointments}
              >
                Refresh
              </button>

            </div>

            {/* ================= LOADING ================= */}

            {loading && (
              <p className="loading">
                Loading appointments...
              </p>
            )}

            {/* ================= NO APPOINTMENTS ================= */}

            {!loading &&
              appointments.length === 0 &&
              !error && (
                <p className="no-appointments">
                  No appointments found.
                </p>
              )}

            {/* ================= APPOINTMENT TABLE ================= */}

            {!loading &&
              appointments.length > 0 && (

                <div className="table-container">

                  <table>

                    <thead>

                      <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>

                    </thead>

                    <tbody>

                      {appointments.map((appointment) => (

                        <tr key={appointment._id}>

                          <td>
                            {appointment.name}
                          </td>

                          <td>
                            {appointment.email}
                          </td>

                          <td>
                            {appointment.phone}
                          </td>

                          <td>
                            {appointment.address}
                          </td>

                          <td>
                            {appointment.service}
                          </td>

                          <td>
                            {appointment.date}
                          </td>

                          <td>
                            {appointment.time}
                          </td>

                          <td>

                            <span
                              className={`status ${
                                appointment.status?.toLowerCase() ||
                                "pending"
                              }`}
                            >
                              {appointment.status || "Pending"}
                            </span>

                          </td>

                          <td>

                            <select
                              value={
                                appointment.status ||
                                "Pending"
                              }
                              onChange={(e) =>
                                updateStatus(
                                  appointment._id,
                                  e.target.value
                                )
                              }
                            >

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="Confirmed">
                                Confirmed
                              </option>

                              <option value="Cancelled">
                                Cancelled
                              </option>

                            </select>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

          </section>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;