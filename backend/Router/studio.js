require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const TrendingData = require("../Models/trending");
const Studio = express.Router();

Studio.post("/deletevideo/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  try {
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
        },
      }
    );

    await userData.updateMany(
      { "watchLater.savedVideoID": videoId },
      {
        $set: {
          "watchLater.$.thumbnailURL": thumbnail,
          "watchLater.$.Title": title,
        },
      }
    );

    await userData.updateMany(
      { "Playlists.playlist_videos.videoID": videoId },
      {
        $set: {
          "Playlists.$[playlist].playlist_videos.$[video]": {
            thumbnail: thumbnail,
            title: title,
            description: desc,
          },
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

module.exports = Studio;
