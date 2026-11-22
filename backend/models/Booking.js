const mongoose = require("mongoose");

const TIME_SLOTS = [
  {
    value: "MORNING",
    label: "Morning",
    timeRange: "07:00 AM – 12:00 PM"
  },
  {
    value: "AFTERNOON",
    label: "Afternoon",
    timeRange: "12:00 PM – 07:00 PM"
  },
  {
    value: "NIGHT",
    label: "Night",
    timeRange: "07:00 PM – 12:00 AM"
  }
];

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  timeSlot: {
    type: String,
    required: true,
    enum: TIME_SLOTS.map(slot => slot.value)
  },
  guestCount: { type: Number, required: true },
  specialRequirements: { type: String, default: "" }
}, { timestamps: true });

// Prevent duplicate bookings for the same date and slot.
bookingSchema.index(
  { eventDate: 1, timeSlot: 1 },
  { unique: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
module.exports.TIME_SLOTS = TIME_SLOTS;
