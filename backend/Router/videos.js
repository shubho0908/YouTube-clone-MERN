require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const TrendingData = require("../Models/trending");
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
    const trending = await TrendingData.findOne({ videoid: id });

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

    if (!trending) {
      return res.status(404).json({ error: "Video not found" });
    }
    trending.views += 1;
    await trending.save();
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

    if (savedData && savedData.length > 0) {
      res.json(savedData);
    } else {
      res.json({ savedData: "NO DATA" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/totalviews/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const video = await videodata.findOne({ email });
    if (!video) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    let totalViews = 0;

    video.VideoData.forEach((video) => {
      totalViews += video.views;
    });

    res.json(totalViews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/checktrending/:videoID", async (req, res) => {
  try {
    const { videoID } = req.params;
    const video = await videodata.findOne({ "VideoData._id": videoID });
    if (!video) {
      return res.status(404).json({ error: "Video doesn't exist" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoID
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const mainVideo = video.VideoData[videoIndex];
    const Views = video.VideoData[videoIndex].views;
    const publish = video.VideoData[videoIndex].uploaded_date;

    const currentDate = new Date();
    const publishDate = new Date(publish);
    const timeDiffMs = currentDate - publishDate;

    const timeDiffHours = Math.round(timeDiffMs / (1000 * 60 * 60)); // Convert ms to hours

    const trendingVideo = await TrendingData.findOne({
      videoid: videoID,
    });

    if (timeDiffHours < 24 && Views === 5 && !trendingVideo) {
      const trending = new TrendingData({
        thumbnailURL: mainVideo.thumbnailURL,
        uploader: mainVideo.uploader,
        videoURL: mainVideo.videoURL,
        ChannelProfile: mainVideo.ChannelProfile,
        Title: mainVideo.Title,
        Description: mainVideo.Description,
        videoLength: mainVideo.videoLength,
        views: mainVideo.views,
        uploaded_date: mainVideo.uploaded_date,
        videoid: mainVideo._id,
      });
      return await trending.save();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/gettrending", async (req, res) => {
  try {
    const trending = await TrendingData.find();
    res.json(trending);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/search/:data", async (req, res) => {
  try {
    const { data } = req.params;
    const video = await videodata.find();
    const users = await userData.find({}, { channelData: 1 });

    const filteredVideos = video.reduce((accumulator, element) => {
      const filteredVideoData = element.VideoData.filter((item) => {
        const includesTitle = item.Title.toLowerCase().includes(
          data.toLowerCase()
        );
        const includesTags = item.Tags.toLowerCase().includes(
          data.toLowerCase()
        );
        return includesTitle || includesTags;
      });
      if (filteredVideoData.length > 0) {
        accumulator.push(...filteredVideoData);
      }
      return accumulator;
    }, []);

    const filteredChannels = users.filter((userData) =>
      userData.channelData.some((channel) =>
        channel.channelName.toLowerCase().includes(data.toLowerCase())
      )
    );

    if (filteredVideos.length > 0 && filteredChannels.length > 0) {
      res.json({
        videoData: filteredVideos,
        channelData: filteredChannels[0].channelData,
      });
    } else if (filteredVideos.length > 0) {
      res.json({ videoData: filteredVideos });
    } else if (filteredChannels.length > 0) {
      res.json({ channelData: filteredChannels[0].channelData });
    } else {
      res.json({ videoData: "NO DATA", channelData: "NO DATA" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = Videos;
