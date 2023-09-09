require("dotenv").config();
require("../Database/database");
const userData = require("../Models/user");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();
const auth = require("./auth");
const Channel = require("./channel");
const Videos = require("./videos");
const Likes = require("./likes");
const Comments = require("./comments");
const Studio = require("./studio");

// Middlewares
router.use(
  cors({
    origin: ["https://shubho-youtube-mern.netlify.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(auth);
router.use(Channel);
router.use(Videos);
router.use(Likes);
router.use(Comments);
router.use(Studio);

router.get("/", (req, res) => {
  res.send("Welcome to Youtube App Backend!");
});

router.get("/:userId/:token", async (req, res) => {
  try {
    const { userId, token } = req.params;
    const user = await userData.findOne({ _id: userId });

    const newToken = token.toString();

    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    if (!newToken || !token) {
      return res.status(404).json({
        message: "INVALID TOKEN",
      });
    }

    jwt.verify(newToken, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(401).json({ message: "Token verification failed" });
      }
      // res.render("reset-password", {
      //   email: payload.email,
      // });
      res.render("WELCOME BHAI");
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/resetpassword", async (req, res) => {
  try {
    const password1 = req.body.new_password;
    const password2 = req.body.new_password1;
    const email = req.body.email;

    if (password1 === "" || password2 === "") {
      return res.send("Input fields can't be empty!");
    } else if (password1 !== password2) {
      return res.send("Passwords don't match!");
    } else {
      const user = await userData.findOne({ email });

      if (!user) {
        return res.send("USER DOESN'T EXIST");
      }

      const checkPassword = await bcrypt.compare(password1, user.password);

      if (checkPassword) {
        return res.send("New Password can't be the same as the Old Password.");
      } else {
        const hashedPassword = await bcrypt.hash(password1, 11);
        user.password = hashedPassword;
        await user.save();
        return res.render("done");
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
