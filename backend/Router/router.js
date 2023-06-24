require("dotenv").config();
require("../Database/database");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const router = express.Router();

// Middlewares
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.send("Welcome to Youtube App Backend!");
});

router.post("/signup", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

router.get("/getchannel/:email", async (req, res) => {
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
      res.json({ channel, profile, ChannelName });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

router.post("/savechannel", async (req, res) => {
  try {
    const { email, ChannelName, profileURL } = req.body;
    const user = await userData.findOneAndUpdate(
      { email },
      {
        $set: {
          profilePic: profileURL,
          channelName: ChannelName,
          hasChannel: true,
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

router.post("/publish", async (req, res) => {
  try {
    const {
      videoTitle,
      videoDescription,
      tags,
      videoLink,
      thumbnailLink,
      video_duration,
      email,
      publishDate,
    } = req.body;

    const user = await userData.findOne({ email });
    let videos = await videodata.findOne({ email });

    if (user) {
      user.videos.push({ videoURL: videoLink, videoLength: video_duration });
      user.thumbnails.push({ imageURL: thumbnailLink });

      if (!videos) {
        videos = new videodata({
          email,

          VideoData: [
            {
              thumbnailURL: thumbnailLink,
              uploader: user.channelName,
              videoURL: videoLink,
              ChannelProfile: user.profilePic,
              Title: videoTitle,
              Description: videoDescription,
              Tags: tags,
              videoLength: video_duration,
              uploaded_date: publishDate,
            },
          ],
        });
      } else {
        videos.VideoData.push({
          thumbnailURL: thumbnailLink,
          uploader: user.channelName,
          videoURL: videoLink,
          ChannelProfile: user.profilePic,
          Title: videoTitle,
          Description: videoDescription,
          Tags: tags,
          videoLength: video_duration,
          uploaded_date: publishDate,
        });
      }

      await user.save();
      await videos.save();

      return res.status(200).json({ message: "Video published" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/getvideos", async (req, res) => {
  try {
    const videos = await videodata.find({});
    const videoURLs = videos.flatMap((video) =>
      video.VideoData.map((data) => data.videoURL)
    );
    const thumbnailURLs = videos.flatMap((video) =>
      video.VideoData.map((data) => data.thumbnailURL)
    );
    const titles = videos.flatMap((video) =>
      video.VideoData.map((data) => data.Title)
    );
    const Uploader = videos.flatMap((video) =>
      video.VideoData.map((data) => data.uploader)
    );
    const Duration = videos.flatMap((video) =>
      video.VideoData.map((data) => data.videoLength)
    );
    const Profile = videos.flatMap((video) =>
      video.VideoData.map((data) => data.ChannelProfile)
    );
    const videoID = videos.flatMap((video) =>
      video.VideoData.map((data) => data.id)
    );
    const comments = videos.flatMap((video) =>
      video.VideoData.map((data) => data.comments)
    );
    const views = videos.flatMap((video) =>
      video.VideoData.map((data) => data.views)
    );
    const uploadDate = videos.flatMap((video) =>
      video.VideoData.map((data) => data.uploaded_date)
    );
    const Likes = videos.flatMap((video) =>
      video.VideoData.map((data) => data.likes)
    );

    res.json({
      thumbnailURLs,
      videoURLs,
      titles,
      Uploader,
      Profile,
      Duration,
      videoID,
      comments,
      views,
      Likes,
      uploadDate,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/getuserdata/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const videos = await videodata.findOne({ email });
    const channelIMG = videos.VideoData.map((data) => data.ChannelProfile);
    res.json({ channelIMG });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/videodata/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const video = await videodata.findOne({ "VideoData._id": id });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/checkchannel/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });
    const channel = user.channelName;
    res.json(channel);
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/comments/:id", async (req, res) => {
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

router.post("/updateview/:id", async (req, res) => {
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

    video.VideoData[videoIndex].views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/like/:id/:email", async (req, res) => {
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

    if (!existingLikedVideo) {
      user.likedVideos.push({
        videoURL: likedData.videoURL,
        thumbnailURL: likedData.thumbnailURL,
        uploader: likedData.uploader,
        ChannelProfile: likedData.ChannelProfile,
        Title: likedData.Title,
        videoLength: likedData.videoLength,
        views: likedData.views,
        uploaded_date: likedData.uploaded_date,
        likedVideoID: likedData._id,
      });
      video.VideoData[videoIndex].likes += 1;
    } else {
      user.likedVideos = user.likedVideos.filter(
        (likedVideo) => likedVideo.likedVideoID !== likedData._id.toString()
      );
      video.VideoData[videoIndex].likes -= 1;
    }

    await user.save();
    await video.save();
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/getlike/:id", async (req, res) => {
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

router.get("/getuserlikes/:id/:email", async (req, res) => {
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

router.post("/likecomment/:id/:email", async (req, res) => {
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

router.get("/likecomment/:email", async (req, res) => {
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

module.exports = router;
