require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const Comments = express.Router();

Comments.post("/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, email, channelID } = req.body;

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
      videoid: id,
      user_profile: user.profilePic,
      comment: comment,
      channel_id: channelID,
      time: new Date().toISOString(),
      likes: 0,
      user_email: email,
    };

    vid.VideoData[videoIndex].comments.push(newComment);

    await vid.save();

    res.json("Uploaded");
  } catch (error) {
    res.json(error.message);
  }
});

Comments.post("/likecomment/:videoId/:commentId/:email", async (req, res) => {
  try {
    const { videoId, commentId, email } = req.params;

    const video = await videodata.findOne({ "VideoData._id": videoId });
    const user = await userData.findOne({ email });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comments = video.VideoData[videoIndex].comments;

    const commentIndex = comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = comments[commentIndex];

    const likedCommentIndex = user.likedComments.findIndex(
      (likedComment) => likedComment.comment_ID === commentId
    );

    if (likedCommentIndex === -1) {
      user.likedComments.push({ comment_ID: commentId });
      comment.likes += 1;
    } else {
      user.likedComments.splice(likedCommentIndex, 1);
      comment.likes -= 1;
    }

    await user.save();
    await video.save();

    res.status(200).json({ message: "Comment liked/unliked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Comments.post("/heartcomment/:videoId/:commentID", async (req, res) => {
  try {
    const { videoId, commentID } = req.params;

    const video = await videodata.findOne({ "VideoData._id": videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comments = video.VideoData[videoIndex].comments;
    const findComment = comments.find(
      (item) => item._id.toString() === commentID.toString()
    );

    if (findComment.heartComment === true) {
      findComment.heartComment = false;
    } else {
      findComment.heartComment = true;
    }

    await video.save();

    res.json(findComment.heartComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Comments.get("/getheartcomment/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await videodata.findOne({ "VideoData._id": videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comments = video.VideoData[videoIndex].comments;
    const heart = comments.flatMap((item) => item.heartComment);

    res.json(heart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Comments.get("/likecomment/:videoId", async (req, res) => {
  try {
    const { videoId, email } = req.params;
    const video = await videodata.findOne({ "VideoData._id": videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comments = video.VideoData[videoIndex].comments;

    res.json(comments);
  } catch (error) {
    res.json(error.message);
  }
});

Comments.get("/getcomments/:id", async (req, res) => {
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
    const comments = video.VideoData[videoIndex].comments;
    res.json(comments);
  } catch (error) {
    res.json(error.message);
  }
});

Comments.post("/deletecomment/:videoId/:commentId/:email", async (req, res) => {
  try {
    const { videoId, commentId, email } = req.params;

    const video = await videodata.findOne({ "VideoData._id": videoId });
    const user = await userData.findOne({ email });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comments = video.VideoData[videoIndex].comments;

    const existingCommentIndex = comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (existingCommentIndex !== -1) {
      // Remove the comment from the comments array
      comments.splice(existingCommentIndex, 1);

      // Save the updated video document
      await video.save();

      res.json("Comment Deleted");
    } else {
      return res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = Comments;
