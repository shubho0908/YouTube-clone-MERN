require("dotenv").config();
require("../Database/database");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userData = require("../Models/user");
const auth = express.Router();
const nodemailer = require("nodemailer");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} = require("../lib/tokens");

auth.use(cookieParser());

auth.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const availableAccessToken = req.cookies?.accessToken;
    const availableRefreshToken = req.cookies?.refreshToken;

    if (availableAccessToken || availableRefreshToken) {
      return res.status(400).json({
        message: "You are already logged in",
      });
    }

    const user = await userData.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "USER ALREADY EXISTS",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 11);
    const saveData = new userData({
      name,
      email,
      password: hashedPassword,
    });
    await saveData.save();

    //Create access token
    const accessToken = generateAccessToken(saveData);
    const refreshToken = generateRefreshToken(saveData);

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
        return res.status(400).json({
          success: false,
          message: "Error sending email",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          success: true,
          message: "Registration mail sent to your email",
        });
      }
    });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: false,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: false,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "REGISTRATION SUCCESSFUL",
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

auth.post("/login", async (req, res) => {
  try {
    const { email1, password1 } = req.body;
    const availableAccessToken = req.cookies?.accessToken;
    const availableRefreshToken = req.cookies?.refreshToken;

    if (availableAccessToken || availableRefreshToken) {
      return res.status(400).json({
        message: "You are already logged in",
      });
    }

    const user = await userData.findOne({ email: email1 });
    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    const userPassword = user.password;
    const checkPassword = await bcrypt.compare(password1, userPassword);
    if (checkPassword) {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        const newRefreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user);
        res
          .cookie("refreshToken", newRefreshToken, {
            httpOnly: false,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          })
          .cookie("accessToken", accessToken, {
            httpOnly: false,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
        user.refreshToken = newRefreshToken;
        await user.save();
      } else {
        const accessToken = generateAccessToken(user);
        res.cookie("accessToken", accessToken, {
          httpOnly: false,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
      }
      return res.status(200).json({
        message: "LOGIN SUCCESSFUL",
      });
    } else {
      res.status(401).json({
        message: "INVALID CREDENTIALS",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

auth.post("/resetlink", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    const resetToken = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "30m",
    });
    const resetLink = `${process.env.BACKEND_URL}/${user?._id}/${resetToken}`;

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
        return res.status(400).json({
          message: "Error sending email",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          message: "Password reset link sent to your email",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

auth.get("/logout", (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    if (!accessToken || !refreshToken) {
      return res.status(400).json({
        success: false,
        message: "You are not logged in",
      });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

auth.get("/userdata", async (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    if (!accessToken || !refreshToken) {
      return res.status(400).json({
        success: false,
        message: "You are not logged in",
      });
    }

    const userdata = verifyAccessToken(accessToken);
    const user = await userData.findById(userdata?.id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = auth;
