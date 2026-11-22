
const express = require("express");
const Booking = require("../models/Booking");
const { TIME_SLOTS } = require("../models/Booking");

const router = express.Router();

function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

// GET: Check available slots for a selected date
router.get("/slots", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid date."
      });
    }

    const bookings = await Booking.find({
      eventDate: date
    }).select("timeSlot -_id");

    const booked = bookings.map(booking => booking.timeSlot);

    const availableSlots = TIME_SLOTS.map(slot => ({
      value: slot.value,
      label: slot.label,
      timeRange: slot.timeRange,
      available: !booked.includes(slot.value)
    }));

    return res.status(200).json({
      success: true,
      date,
      slots: availableSlots
    });

  } catch (error) {
    console.error("Slot availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to check availability."
    });
  }
});


// POST: Register a new booking
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      eventDate,
      timeSlot,
      guestCount,
      specialRequirements = ""
    } = req.body;

    // Required field validation
    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !eventDate ||
      !timeSlot ||
      guestCount === undefined ||
      guestCount === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields."
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address."
      });
    }

    // Indian mobile number validation
    const cleanPhone = phone.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit Indian mobile number."
      });
    }

    // Event date validation
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(eventDate) ||
      eventDate < todayInIndia()
    ) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid date that is not in the past."
      });
    }

    // Verify the selected time slot
    const validSlot = TIME_SLOTS.some(
      slot => slot.value === timeSlot
    );

    if (!validSlot) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid time slot."
      });
    }

    // Guest count validation
    const guests = Number(guestCount);

    if (
      !Number.isInteger(guests) ||
      guests < 1 ||
      guests > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Guest count must be between 1 and 1000."
      });
    }

    // Save booking in MongoDB
    const booking = await Booking.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      eventDate,
      timeSlot,
      guestCount: guests,
      specialRequirements: String(specialRequirements).trim()
    });

    return res.status(201).json({
      success: true,
      message: "Your event hall booking has been confirmed!",
      booking: {
        id: booking._id,
        fullName: booking.fullName,
        eventDate: booking.eventDate,
        timeSlot: booking.timeSlot
      }
    });

  } catch (err) {

    // Duplicate date + time slot protection
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This slot has already been booked. Please choose another slot."
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    console.error("Booking creation error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to complete booking. Please try again."
    });
  }
});

module.exports = router;
