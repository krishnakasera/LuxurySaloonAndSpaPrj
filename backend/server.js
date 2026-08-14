require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceRoutes = require("./routes/servicesRoutes");

const app = express();

// =====================================
// CONNECT DATABASE
// =====================================

connectDB();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());

// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// =====================================
// AUTH ROUTES
// =====================================

app.use("/api/auth", authRoutes);

// =====================================
// APPOINTMENT ROUTES
// =====================================

app.use("/api/appointments", appointmentRoutes);

// =====================================
// SERVICE ROUTES
// =====================================

app.use("/api/services", serviceRoutes);

// =====================================
// ADMIN ROUTES
// =====================================

app.use("/api/admin", adminRoutes);

// =====================================
// START SERVER
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});