require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const cookieParser = require("cookie-parser");
const { verifyRefreshToken, generateAccessToken } = require("../lib/tokens");
const Likes = express.Router();

Likes.use(cookieParser());

Likes.post("/like/:id/:email/:email2", async (req, res) => {
  try {
    const { id, email, email2 } = req.params;

    const refreshToken = req.cookies?.refreshToken;
    const accessToken = req.cookies?.accessToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized access, please login again",
      });
    }
    if (!accessToken) {
      //Refresh the access token
      const userID = verifyRefreshToken(refreshToken);
      const userData = { id: userID };
      const accessToken = generateAccessToken(userData);
      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    const video = await videodata.findOne({ "VideoData._id": id });
    const user = await userData.findOne({ email });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const likedData = video.VideoData[videoIndex];

    const existingLikedVideo = user.likedVideos.find(
      (likedVideo) => likedVideo.likedVideoID === likedData._id.toString()
    );

    if (!existingLikedVideo) {
      user.likedVideos.push({
        email: email2,
        videoURL: likedData.videoURL,
        thumbnailURL: likedData.thumbnailURL,
        uploader: likedData.uploader,
        ChannelProfile: likedData.ChannelProfile,
        Title: likedData.Title,
        videoLength: likedData.videoLength,
        views: likedData.views,
        uploaded_date: likedData.uploaded_date,
        likedVideoID: likedData._id,
        videoprivacy: likedData.visibility,
      });
      video.VideoData[videoIndex].likes += 1;
      res
        .status(200)
        .json({ message: "Liked", likes: video?.VideoData[videoIndex]?.likes });
    } else {
      user.likedVideos = user.likedVideos.filter(
        (likedVideo) => likedVideo.likedVideoID !== likedData._id.toString()
      );
      video.VideoData[videoIndex].likes -= 1;
      res
        .status(200)
        .json({
          message: "Disliked",
          likes: video?.VideoData[videoIndex]?.likes,
        });
    }

    await user.save();
    await video.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Likes.get("/getlike/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const video = await videodata.findOne({ "VideoData._id": id });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const likes = video.VideoData[videoIndex].likes;

    res.json(likes);
  } catch (error) {
    res.json(error.message);
  }
});

Likes.get("/getuserlikes/:id/:email", async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.params.email;

    const video = await videodata.findOne({ "VideoData._id": id });
    const user = await userData.findOne({ email });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const likedData = video.VideoData[videoIndex];

    const existingLikedVideo = user.likedVideos.find(
      (likedVideo) => likedVideo.likedVideoID === likedData._id.toString()
    );

    res.json({ existingLikedVideo });
  } catch (error) {
    res.json(error.message);
  }
});

Likes.post("/dislikevideo/:id/:email", async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.params.email;

    const refreshToken = req.cookies?.refreshToken;
    const accessToken = req.cookies?.accessToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized access, please login again",
      });
    }
    if (!accessToken) {
      //Refresh the access token
      const userID = verifyRefreshToken(refreshToken);
      const userData = { id: userID };
      const accessToken = generateAccessToken(userData);
      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    const video = await videodata.findOne({ "VideoData._id": id });
    const user = await userData.findOne({ email });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const likedData = video.VideoData[videoIndex];
    const videoLikes = video.VideoData[videoIndex].likes;

    const existingLikedVideo = user.likedVideos.find(
      (likedVideo) => likedVideo.likedVideoID === likedData._id.toString()
    );

    if (videoLikes > 0 && existingLikedVideo) {
      user.likedVideos = user.likedVideos.filter(
        (likedVideo) => likedVideo.likedVideoID !== likedData._id.toString()
      );
      video.VideoData[videoIndex].likes -= 1;
    }

    await user.save(); // Save changes to the user object
    await video.save(); // Save changes to the video object

    res.status(200).json({ message: "Disliked", likes: video?.VideoData[videoIndex]?.likes });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = Likes;
