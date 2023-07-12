require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const Videos = express.Router();

Videos.post("/publish", async (req, res) => {
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

Videos.get("/getvideos", async (req, res) => {
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

Videos.get("/getuserimage/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });
    const channelIMG = user.profilePic;
    res.json({ channelIMG });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

Videos.get("/videodata/:id", async (req, res) => {
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

Videos.post("/updateview/:id", async (req, res) => {
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
    console.log("Views updated");
    await video.save();

    res.json(video);
  } catch (error) {
    res.json(error.message);
  }
});

Videos.get("/getlikevideos/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });
    if (!user) {
      return res.json("USER DOESN'T EXISTS");
    }
    const LikedData = user.likedVideos;
    res.json(LikedData);
  } catch (error) {
    res.json(error.message);
  }
});

Videos.post("/watchlater/:id/:email", async (req, res) => {
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

    const WatchLater = video.VideoData[videoIndex];

    const existingSavedVideo = user.watchLater.find(
      (savedVideo) => savedVideo.savedVideoID === WatchLater._id.toString()
    );

    if (!existingSavedVideo) {
      user.watchLater.push({
        videoURL: WatchLater.videoURL,
        thumbnailURL: WatchLater.thumbnailURL,
        uploader: WatchLater.uploader,
        ChannelProfile: WatchLater.ChannelProfile,
        Title: WatchLater.Title,
        videoLength: WatchLater.videoLength,
        views: WatchLater.views,
        uploaded_date: WatchLater.uploaded_date,
        savedVideoID: WatchLater._id,
      });
    } else {
      user.watchLater = user.watchLater.filter(
        (savedVideo) => savedVideo.savedVideoID !== WatchLater._id.toString()
      );
    }

    await user.save();
    await video.save();
  } catch (error) {
    res.json(error.message);
  }
});

Videos.get("/checkwatchlater/:id/:email", async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.params.email;
    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const userIndex = user.watchLater.findIndex(
      (data) => data.savedVideoID.toString() === id
    );

    if (userIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const savedID = user.watchLater[userIndex].savedVideoID;

    res.json(savedID);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/getwatchlater/:email", async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.params.email;
    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }
    const savedData = user.watchLater;

    res.json(savedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = Videos;
