import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminAppointment.css";

import AdminSidebar from "../../Components/Navbar/AdminSidebar/AdminSidebar";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("adminToken");

  // =====================================
  // FETCH APPOINTMENTS
  // =====================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Admin login required.");
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

      console.log("Admin appointments:", response.data);

      if (Array.isArray(response.data.appointments)) {
        setAppointments(response.data.appointments);
        setFilteredAppointments(response.data.appointments);
      } else {
        setAppointments([]);
        setFilteredAppointments([]);
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
  // SEARCH + FILTER
  // =====================================

  useEffect(() => {
    let result = [...appointments];

    // Search
    if (search.trim() !== "") {
      const searchText = search.toLowerCase();

      result = result.filter((appointment) =>
        appointment.name?.toLowerCase().includes(searchText) ||
        appointment.email?.toLowerCase().includes(searchText) ||
        appointment.phone?.toString().includes(searchText) ||
        appointment.service?.toLowerCase().includes(searchText)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter(
        (appointment) =>
          appointment.status === statusFilter
      );
    }

    setFilteredAppointments(result);

  }, [search, statusFilter, appointments]);

  // =====================================
  // UPDATE STATUS
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

  const total = appointments.length;

  const pending = appointments.filter(
    (appointment) =>
      appointment.status === "Pending"
  ).length;

  const confirmed = appointments.filter(
    (appointment) =>
      appointment.status === "Confirmed"
  ).length;

  const cancelled = appointments.filter(
    (appointment) =>
      appointment.status === "Cancelled"
  ).length;

  // =====================================
  // UI
  // =====================================

  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}

      <AdminSidebar />

      {/* ================= MAIN ================= */}

      <main className="admin-main">

        <div className="admin-appointments-page">

          {/* ================= HEADER ================= */}

          <div className="appointments-header">

            <div>
              <h1>Appointments</h1>

              <p>
                Manage all Luxury Salon & Spa appointments
              </p>
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="appointment-error">
              {error}
            </div>
          )}

          {/* ================= STATISTICS ================= */}

          <div className="appointment-stats">

            <div className="appointment-stat">
              <span>Total</span>
              <strong>{total}</strong>
            </div>

            <div className="appointment-stat pending-stat">
              <span>Pending</span>
              <strong>{pending}</strong>
            </div>

            <div className="appointment-stat confirmed-stat">
              <span>Confirmed</span>
              <strong>{confirmed}</strong>
            </div>

            <div className="appointment-stat cancelled-stat">
              <span>Cancelled</span>
              <strong>{cancelled}</strong>
            </div>

          </div>

          {/* ================= FILTERS ================= */}

          <div className="appointment-filters">

            <input
              type="text"
              placeholder="Search by name, email, phone or service..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

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

            <button
              className="refresh-appointments"
              onClick={fetchAppointments}
            >
              Refresh
            </button>

          </div>

          {/* ================= TABLE ================= */}

          <div className="appointments-card">

            {loading ? (

              <div className="appointments-loading">
                Loading appointments...
              </div>

            ) : filteredAppointments.length === 0 ? (

              <div className="appointments-empty">
                No appointments found.
              </div>

            ) : (

              <div className="appointments-table-container">

                <table className="appointments-table">

                  <thead>

                    <tr>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredAppointments.map(
                      (appointment) => (

                        <tr key={appointment._id}>

                          {/* Customer */}

                          <td>
                            <strong>
                              {appointment.name}
                            </strong>
                          </td>

                          {/* Contact */}

                          <td>
                            <div>
                              {appointment.email}
                            </div>

                            <small>
                              {appointment.phone}
                            </small>
                          </td>

                          {/* Service */}

                          <td>
                            {appointment.service}
                          </td>

                          {/* Date */}

                          <td>
                            {appointment.date}
                          </td>

                          {/* Time */}

                          <td>
                            {appointment.time}
                          </td>

                          {/* Address */}

                          <td>
                            {appointment.address}
                          </td>

                          {/* Status */}

                          <td>

                            <span
                              className={`appointment-status ${
                                appointment.status
                                  ?.toLowerCase() ||
                                "pending"
                              }`}
                            >
                              {appointment.status ||
                                "Pending"}
                            </span>

                          </td>

                          {/* Action */}

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

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminAppointments;