import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyAppointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (!storedUser) {
        setError("Please login first.");
        return;
      }

      if (!storedUser.email) {
        setError("User email is missing.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/appointments/my",
        {
          params: {
            email: storedUser.email,
          },
        }
      );

      console.log(
        "Appointments:",
        response.data
      );

      setAppointments(response.data);
    } catch (error) {
      console.error(
        "Appointment loading error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CANCEL APPOINTMENT
  // =====================================

  const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancellingId(appointmentId);

      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/cancel`
      );

      console.log(
        "Cancel response:",
        response.data
      );

      // Update UI immediately
      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status: "Cancelled",
              }
            : appointment
        )
      );

      alert("Appointment cancelled successfully!");
    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to cancel appointment."
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="my-appointments">
        <h1>My Appointments</h1>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="my-appointments">
      <h1>My Appointments</h1>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!error && appointments.length === 0 && (
        <div className="empty">
          <h2>No Appointments Booked Yet</h2>

          <p>
            Your appointments will appear here.
          </p>
        </div>
      )}

      {!error && appointments.length > 0 && (
        <div className="appointment-list">
          {appointments.map((appointment) => (
            <div
              className="appointment-card"
              key={appointment._id}
            >
              <h2>{appointment.service}</h2>

              <p>
                <strong>Name:</strong>{" "}
                {appointment.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {appointment.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {appointment.phone ||
                  "Not provided"}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {appointment.address ||
                  "Not provided"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {appointment.date}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {appointment.time}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="status">
                  {appointment.status ||
                    "Pending"}
                </span>
              </p>

              {/* CANCEL BUTTON */}

              {appointment.status !==
                "Cancelled" && (
                <button
                  className="cancel-btn"
                  onClick={() =>
                    handleCancel(
                      appointment._id
                    )
                  }
                  disabled={
                    cancellingId ===
                    appointment._id
                  }
                >
                  {cancellingId ===
                  appointment._id
                    ? "Cancelling..."
                    : "Cancel Appointment"}
                </button>
              )}

              {appointment.status ===
                "Cancelled" && (
                <p className="cancelled-message">
                  ✓ This appointment has been
                  cancelled.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;