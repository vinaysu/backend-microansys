const mongoose = require("mongoose");

// Define a schema for OTP data
const OtpSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a model based on the schema
const OtpModel = mongoose.model("Otp", OtpSchema);

module.exports = OtpModel;
