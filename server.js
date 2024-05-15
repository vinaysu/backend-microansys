const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const FormDataModel = require("./model");
const OtpModel = require("./otpModel");
const path = require("path");
const twilio = require("twilio");

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection URI
const MONGODB_URI =
  "mongodb+srv://vinay:vinay.s@vinay.leowher.mongodb.net/?retryWrites=true&w=majority&appName=vinay";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.post("/api/formdata", async (req, res) => {
  try {
    // Create a new instance of the FormDataModel using the request body
    const formData = new FormDataModel(req.body);

    // Save the form data to the database
    const savedData = await formData.save();

    // Respond with a success message and the saved data
    res
      .status(201)
      .json({ message: "Form data saved successfully", data: savedData });
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error("Error saving form data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/list", async (req, res) => {
  try {
    // Fetch the list data from MongoDB
    const list = await FormDataModel.find();
    res.json(list); // Send the list data as JSON response
  } catch (error) {
    console.error("Error fetching list data:", error);
    res.status(500).json({ error: "Failed to fetch list data" });
  }
});

const otpDatabase = {};

app.post("/sendOTP", async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Save OTP to the database
    const otpData = new OtpModel({
      mobileNumber: mobileNumber,
      otp: otp.toString(), // Convert OTP to string before saving
    });
    await otpData.save();

    // Send OTP via Twilio
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: twilioNumber,
      to: `+91${mobileNumber}`, // Assuming mobileNumber is in Indian format
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP at server side :", error);
    res.status(500).json({ message: "Failed to send OTP at server side " });
  }
});

// Route to verify OTP
app.post("/verifyOTP", async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    // Retrieve OTP from database
    const storedOTP = otpDatabase[mobileNumber];

    // Validate OTP
    if (storedOTP && otp === storedOTP) {
      // Remove OTP from database after successful verification
      delete otpDatabase[mobileNumber];
      res.json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
