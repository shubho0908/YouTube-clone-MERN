require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const Comments = express.Router();

Comments.post("/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, email } = req.body;

    const video = await videodata.find({});

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const vid = video.find((vidData) =>
      vidData.VideoData.some((data) => data._id.toString() === id)
    );

    if (!vid) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoIndex = vid.VideoData.findIndex(
      (data) => data._id.toString() === id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const newComment = {
      username: user.channelName,
      user_profile: user.profilePic,
      comment: comment,
      time: new Date().toISOString(),
      likes: 0,
      user_email: email,
    };

    vid.VideoData[videoIndex].comments.push(newComment);

    await vid.save();

    res.json(vid);
  } catch (error) {
    res.json(error.message);
  }
});

Comments.post("/likecomment/:id/:email", async (req, res) => {
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

    const comments = video.VideoData[videoIndex].comments;
    const commentID = comments[videoIndex]._id.toString();

    const userLikedComment = user.likedComments;

    if (!userLikedComment) {
      user.likedComments = [{ comment_ID: commentID }];
      comments[videoIndex].likes += 1;
    } else {
      const commentIndex = userLikedComment.findIndex(
        (likedComment) => likedComment.comment_ID === commentID
      );

      if (commentIndex === -1) {
        user.likedComments.push({ comment_ID: commentID });
        comments[videoIndex].likes += 1;
      } else {
        user.likedComments.splice(commentIndex, 1);
        comments[videoIndex].likes -= 1;
      }
    }

    await user.save();
    await video.save();
  } catch (error) {
    res.json(error.message);
  }
});

Comments.get("/likecomment/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userLikedComment = user.likedComments;

    res.json(userLikedComment);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = Comments;
