require("dotenv").config();
require("../Database/database");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userData = require("../Models/user");
const auth = express.Router();
const nodemailer = require("nodemailer");
const URL = "http://localhost:3000";

auth.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userData.findOne({ email });
    if (user) {
      return res.json({
        message: "USER ALREADY EXISTS",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 11);
    const token = await jwt.sign({ name, email }, process.env.SECRET_KEY, {
      expiresIn: "12h",
    });
    const saveData = new userData({
      name,
      email,
      password: hashedPassword,
    });
    await saveData.save();

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "admin@shubho.youtube.app",
      to: email,
      subject: "Welcome to Shubho's YouTube Clone!",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h1 style="color: #333;">Welcome to Shubho's YouTube Clone!</h1>
          <p style="color: #555;">Hello ${name},</p>
          <p style="color: #555;">We are excited to have you as a new member of our community! Thank you for joining.</p>
          <p style="color: #555;">Feel free to explore our platform and start sharing your videos with the world.</p>
          <p style="color: #555;">If you have any questions or need assistance, don't hesitate to reach out to us.</p>
          <p style="color: #555;">Best regards,</p>
          <p style="color: #555;">Shubhojeet Bera</p>
        </div>
      `,
    };
    

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.json({
          message: "Error sending email",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.json({
          message: "Password reset link sent to your email",
        });
      }
    });

    res.json({
      message: "REGISTRATION SUCCESSFUL",
      token,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

auth.post("/login", async (req, res) => {
  try {
    const { email1, password1 } = req.body;
    const user = await userData.findOne({ email: email1 });
    if (!user) {
      return res.json({
        message: "USER DOESN'T EXIST",
      });
    }

    const name = user.name;
    const email = user.email;
    const password = user.password;
    const checkPassword = await bcrypt.compare(password1, password);
    if (checkPassword) {
      const token = await jwt.sign({ name, email }, process.env.SECRET_KEY, {
        expiresIn: "12h",
      });
      return res.json({
        message: "LOGIN SUCCESSFUL",
        token,
      });
    } else {
      res.json({
        message: "INVALID CREDENTIALS",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

auth.post("/resetlink", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.json({
        message: "USER DOESN'T EXIST",
      });
    }

    const token = await jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "30m",
    });
    const resetLink = `${URL}/${user._id}/${token}`;

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "admin@shubho.youtube.app",
      to: email,
      subject: "Password Reset Link",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h2 style="color: #333;">Password Reset</h2>
          <p style="color: #555;">Hello,</p>
          <p style="color: #555;">Click the following link to reset your password:</p>
          <p style="margin: 20px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </p>
          <p style="color: #555;">This link is only valid for 30 minutes.</p>
          <p style="color: #555;">If you didn't request a password reset, please ignore this email.</p>
          <p style="color: #888;">Best regards,<br/>Shubhojeet Bera</p>
        </div>
      `,
    };
    

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.json({
          message: "Error sending email",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.json({
          message: "Password reset link sent to your email",
        });
      }
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

module.exports = auth;
