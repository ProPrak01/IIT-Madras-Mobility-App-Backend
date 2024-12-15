const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const fetch = require('node-fetch');
require('dotenv').config();

const apiKey = process.env.API_KEY;
let OTP , user;
authRouter.post("/signup", async (req, res) => {
    try {
      console.log(req.body);
      const { number } = req.body;
      const existingUser = await User.findOne({ number });
      if (existingUser) {
        return res.status(400).json({ msg: "User with the same number already exists" });
      }
      user = new User({ number });
      console.log("Created user with:", { number });
      // Generate OTP
      const otpUrl = `https://2factor.in/API/V1/${apiKey}/SMS/+91${number}/AUTOGEN`;
      const response = await fetch(otpUrl);
      const data = await response.json();
      console.log(data);
  
      if (data.Status === "Success") {
        console.log("OTP sent successfully:", data.Details);
      //   OTP = data.Details; // Store session ID returned by 2Factor
        return res.status(200).json({ msg: "OTP sent successfully" });
      } else {
        throw new Error("Failed to send OTP via 2Factor API");
      }
    } catch (err) {
      console.error("SignUp Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
authRouter.post("/signup/verify", async (req, res) => {
    try {
      console.log(req.body);
      const { otp, number } = req.body;
      const verifyUrl = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/+91${number}/${otp}`;
      const response = await fetch(verifyUrl);
      const data = await response.json();
      console.log(data)  ;  
      if (data.Status === "Success" && data.Details === "OTP Matched") {
        console.log("OTP verified successfully");
        user = await user.save();
        const token = jwt.sign({ id: user._id }, "passwordKEY");
        res.status(200).json({ token, ...user._doc });
      } else {
        return res.status(400).json({ msg: "Incorrect OTP" });
      }
    } catch (err) {
      console.error("OTP Verification Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
authRouter.post("/signin", async (req, res) => {
    try {
        console.log(req.body);
        const { number } = req.body;
        const existingUser = await User.findOne({ number });
        if (!existingUser) {
          return res.status(400).json({ msg: "User doesn't exists" });
        }
        console.log("Signin User:", { number });
        // Generate OTP
        const otpUrl = `https://2factor.in/API/V1/${apiKey}/SMS/+91${number}/AUTOGEN`;
        const response = await fetch(otpUrl);
        const data = await response.json();
        console.log(data);
    
        if (data.Status === "Success") {
          console.log("OTP sent successfully:", data.Details);
        //   OTP = data.Details; // Store session ID returned by 2Factor
          return res.status(200).json({ msg: "OTP sent successfully" });
        } else {
          throw new Error("Failed to send OTP via 2Factor API");
        }
      } catch (err) {
        console.error("SignIn Error:", err.message);
        res.status(500).json({ error: err.message });
      }
    });
authRouter.post("/signin/verify", async (req, res) => {
    try {
        console.log(req.body);
        const { otp, number } = req.body;
        const verifyUrl = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/+91${number}/${otp}`;
        const response = await fetch(verifyUrl);
        const data = await response.json();
        console.log(data)  ;  
        if (data.Status === "Success" && data.Details === "OTP Matched") {
          console.log("OTP verified successfully");
          const token = jwt.sign({ id: user._id }, "passwordKEY");
          res.status(200).json({ token, ...user._doc });
        } else {
          return res.status(400).json({ msg: "Incorrect OTP" });
        }
      } catch (err) {
        console.error("OTP Verification Error:", err.message);
        res.status(500).json({ error: err.message });
      }
    });

// authRouter.post("/signup", signUp);
// authRouter.post("/signup/verify", signupVerify);
// authRouter.post("/signin", signUp);
// authRouter.post("/signin/verify", signupVerify);  

module.exports = authRouter;
