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

auth.post("/reset-link", async (req, res) => {
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
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'andrew.bruen94@ethereal.email',
          pass: 'ESmU5EtNJm2mhKnqEs'
      }
  });

    const mailOptions = {
      from: "admin@youtube.app",
      to: email,
      subject: "Password Reset Link",
      html: `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a> <br/> Only valid for 30 minutes.`,
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
