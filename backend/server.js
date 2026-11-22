require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Booking = require("./models/Booking");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.get("/", (req, res) => res.send("Event Hall Booking API is running"));
app.use("/api/bookings", bookingRoutes);
const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await Booking.init();
  app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
}).catch(err => {
  console.error("Backend startup failed:", err.message);
  process.exit(1);
});
