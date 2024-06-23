require("dotenv").config();
require("../Database/database");
const jwt = require("jsonwebtoken");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const TrendingData = require("../Models/trending");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { verifyRefreshToken, generateAccessToken } = require("../lib/tokens");
const Studio = express.Router();

Studio.use(cookieParser());

Studio.post("/deletevideo/:videoId", async (req, res) => {
  try {
    const videoId = req.params.videoId;

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

    const video = await videodata.findOne({ "VideoData._id": videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    await videodata.updateOne(
      { "VideoData._id": videoId },
      { $pull: { VideoData: { _id: videoId } } }
    );

    await TrendingData.deleteOne({ videoid: videoId });

    await userData.updateMany(
      { "likedVideos.likedVideoID": videoId },
      { $pull: { likedVideos: { likedVideoID: videoId } } }
    );

    await userData.updateMany(
      { "watchLater.savedVideoID": videoId },
      { $pull: { watchLater: { savedVideoID: videoId } } }
    );

    await userData.updateMany(
      { "Playlists.playlist_videos.videoID": videoId },
      { $pull: { "Playlists.$.playlist_videos": { videoID: videoId } } }
    );

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

Studio.get("/getvideodata/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const video = await videodata.findOne({ "VideoData._id": id });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const myVideo = video.VideoData.find(
      (item) => item._id.toString() === id.toString()
    );

    res.json(myVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

Studio.get("/getdeletevideodata/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await videodata.findOne({ "VideoData._id": videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const myVideo = video.VideoData.find(
      (item) => item._id.toString() === videoId.toString()
    );

    res.json(myVideo);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

Studio.post("/savevideoeditdetails/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { thumbnail, title, desc, tags, privacy } = req.body;

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


    await TrendingData.updateOne(
      { videoid: videoId },
      {
        $set: {
          thumbnailURL: thumbnail,
          Title: title,
          Description: desc,
        },
      }
    );

    await videodata.updateOne(
      { "VideoData._id": videoId },
      {
        $set: {
          "VideoData.$.thumbnailURL": thumbnail,
          "VideoData.$.Title": title,
          "VideoData.$.Description": desc,
          "VideoData.$.Tags": tags,
          "VideoData.$.visibility": privacy,
        },
      }
    );

    await userData.updateMany(
      { "likedVideos.likedVideoID": videoId },
      {
        $set: {
          "likedVideos.$.thumbnailURL": thumbnail,
          "likedVideos.$.Title": title,
          "likedVideos.$.videoprivacy": privacy,
        },
      }
    );

    await userData.updateMany(
      { "watchLater.savedVideoID": videoId },
      {
        $set: {
          "watchLater.$.thumbnailURL": thumbnail,
          "watchLater.$.Title": title,
          "watchLater.$.videoprivacy": privacy,
        },
      }
    );

    await userData.updateMany(
      { "Playlists.playlist_videos.videoID": videoId },
      {
        $set: {
          "Playlists.$[playlist].playlist_videos.$[video].thumbnail": thumbnail,
          "Playlists.$[playlist].playlist_videos.$[video].title": title,
          "Playlists.$[playlist].playlist_videos.$[video].description": desc,
          "Playlists.$[playlist].playlist_videos.$[video].videoprivacy":
            privacy,
        },
      },
      {
        arrayFilters: [
          { "playlist.playlist_videos.videoID": videoId },
          { "video.videoID": videoId },
        ],
      }
    );

    res.status(200).json({ message: "Video updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

Studio.get("/getallcomments/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const video = await videodata.findOne({ email });
    if (!video) {
      return res.status(404).json({ error: "User not found" });
    }

    const comments = video.VideoData.flatMap((data) => data.comments);
    const videoid = video.VideoData.flatMap((data) =>
      data.comments.map((item) => item.videoid)
    );

    res.json({ comments, videoid });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

Studio.get("/checklikecomment/:commentId/:email", async (req, res) => {
  try {
    const { commentId, email } = req.params;
    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const checkLikeComment = user.likedComments.find(
      (item) => item.comment_ID.toString() === commentId.toString()
    );

    if (checkLikeComment) {
      res.json(checkLikeComment);
    } else {
      res.json("Not Found");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

Studio.get("/getvideocommentsbyid/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await videodata.findOne({ "VideoData._id": videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const findComments = video.VideoData.filter(
      (item) => item._id.toString() === videoId.toString()
    );
    const videoComments = findComments.flatMap((item) => item.comments);
    res.json(videoComments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

Studio.post("/savelinksdata/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { fblink, instalink, twitterlink, websitelink, channelID } = req.body;

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


    const updatedUserData = await userData.findOneAndUpdate(
      { email, "channelData._id": channelID },
      {
        $set: {
          "channelData.$.socialLinks": {
            facebook: fblink,
            instagram: instalink,
            twitter: twitterlink,
            website: websitelink,
          },
        },
      },
      { new: true }
    );

    if (!updatedUserData) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Social links updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

Studio.get("/:userId/:token", async (req, res) => {
  try {
    const { userId, token } = req.params;
    const user = await userData.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    if (!token) {
      return res.status(404).json({
        message: "INVALID TOKEN",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(401).json({ message: "Token verification failed" });
      }
      res.render("reset-password", {
        email: payload.email,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

Studio.post("/resetpassword", async (req, res) => {
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

module.exports = Studio;
