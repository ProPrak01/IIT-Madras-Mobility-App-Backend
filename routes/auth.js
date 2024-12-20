const express = require("express");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const User = require("../models/user");
require("dotenv").config();

const authRouter = express.Router();
const apiKey = process.env.API_KEY;
const jwtSecret = process.env.JWT_SECRET;

// Helper function to send OTP
const sendOtp = async (number) => {
  if (process.env.NODE_ENV === "production") {
    const otpUrl = `https://2factor.in/API/V1/${apiKey}/SMS/+91${number}/AUTOGEN`;
    const response = await fetch(otpUrl);
    const data = await response.json();
    return data;
  } else {
    // Development mode: simulate successful OTP send
    return {
      Status: "Success",
      Details: "dev-session-123", // Fake session ID for development
      Message: "Dev mode: Use 123456 as OTP",
    };
  }
};

// Helper function to verify OTP
const verifyOtp = async (number, otp) => {
  if (process.env.NODE_ENV === "production") {
    const verifyUrl = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/+91${number}/${otp}`;
    const response = await fetch(verifyUrl);
    const data = await response.json();
    console.log(data);
    return data;
  } else {
    // Development mode: accept only "123456" as valid OTP
    return {
      Status: otp === "123456" ? "Success" : "Error",
      Details: otp === "123456" ? "OTP Matched" : "OTP Mismatch",
    };
  }
};

authRouter.get("/", (req, res) => {
  res.send("Hello from auth");
});

// Signup route
authRouter.post("/login", async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) {
      return res.status(400).json({ msg: "Phone number is required" });
    }

    const data = await sendOtp(number);
    if (data.Status === "Success") {
      return res
        .status(200)
        .json({ msg: "OTP sent successfully", sessionId: data.Details });
    } else {
      throw new Error("Failed to send OTP");
    }
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Signup OTP verification route
authRouter.post("/login/verify", async (req, res) => {
  try {
    const { otp, number, name } = req.body;
    if (!otp || !number) {
      return res.status(400).json({ msg: "OTP and number are required" });
    }

    const data = await verifyOtp(number, otp);

    if (data.Status === "Success" && data.Details === "OTP Matched") {
      let user = await User.findOne({ number });
      if (!user) {
        user = new User({ number, name });
        user = await user.save();
      }

      const token = jwt.sign({ id: user._id }, jwtSecret);
      return res.status(200).json({ token, user });
    } else {
      return res.status(400).json({ msg: "Incorrect OTP" });
    }
  } catch (err) {
    console.error("OTP Verification Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all users
authRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Get Users Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = authRouter;
