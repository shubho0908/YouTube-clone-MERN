require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
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
      const channelID = user.channelData[0]._id;
      res.json({ channel, profile, ChannelName, channelID });
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

// PERSONAL CHANNEL DATA

Channel.get("/getuservideos/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const videos = await videodata.findOne({ email });
    if (!videos) {
      return res.json({
        message: "USER DOESN'T EXIST",
      });
    }

    const myvideos = videos.VideoData;
    res.json(myvideos);
  } catch (error) {
    res.json(error.message);
  }
});

Channel.get("/otherchannel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const video = await videodata.findOne({ "VideoData._id": id });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const userEmail = video.email;

    res.json(userEmail);
  } catch (error) {
    res.json(error.message);
  }
});

Channel.get("/getotherchannel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userData.findOne({ "channelData._id": id });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const channelData = user.channelData.find(
      (channel) => channel._id.toString() === id
    );

    if (!channelData) {
      console.log("Channel not found");
      return res.status(404).json({ error: "Channel not found" });
    }

    const userEmail = user.email;

    res.json(userEmail);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

Channel.get("/subscribe/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const mainChannelData = user.channelData[0];
    const channel = mainChannelData.channelName;
    const profile = mainChannelData.channelProfile;
    const channelid = mainChannelData._id;

    const YoutuberData = {
      channel,
      profile,
      channelid,
    };

    res.json(YoutuberData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Channel.post("/subscribe/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { youtuberName, youtuberProfile, youtubeChannelID } = req.body;
    const user = await userData.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    user.subscribedChannels.push({
      channelname: youtuberName,
      channelProfile: youtuberProfile,
      channelID: youtubeChannelID,
    });
    await user.save();

    res.json("SUBSCRIBED CHANNEL");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = Channel;
