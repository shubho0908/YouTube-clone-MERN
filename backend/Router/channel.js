require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const Channel = express.Router();

Channel.get("/getchannel/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });
    if (!user) {
      return res.json({
        message: "USER DOESN'T EXIST",
      });
    } else {
      const channel = user.hasChannel;
      const profile = user.profilePic;
      const ChannelName = user.channelName;
      const channelID = user.channelData[0]._id
      res.json({ channel, profile, ChannelName,channelID });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

Channel.post("/savechannel", async (req, res) => {
  try {
    const { email, ChannelName, profileURL } = req.body;
    const user = await userData.findOneAndUpdate(
      { email },
      {
        $set: {
          profilePic: profileURL,
          channelName: ChannelName,
          hasChannel: true,
          channelData: [
            {
              channelName: ChannelName,
              channelProfile: profileURL,
            },
          ],
        },
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.json({
        message: "USER DOESN'T EXIST",
      });
    }

    return res.json({
      message: "Channel saved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
    });
  }
});

Channel.get("/checkchannel/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });
    const channel = user.channelName;
    res.json(channel);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = Channel;
