require("dotenv").config();
require("../Database/database");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const userData = require("../Models/user");
const router = express.Router();

//Middlewares
router.use(cors());
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("Welcome to Youtube App Backend!");
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userData.findOne({ email });
    if (user) {
      res.json({
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
      message: "REGISTRATION SUCCESSFULL",
      token,
    });
  } catch (error) {}
});

module.exports = router;
