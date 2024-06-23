require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const TrendingData = require("../Models/trending");
const cookieParser = require("cookie-parser");
const { verifyRefreshToken, generateAccessToken } = require("../lib/tokens");
const Videos = express.Router();

Videos.use(cookieParser());

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
      Visibility,
    } = req.body;

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
              visibility: Visibility,
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
          visibility: Visibility,
        });
      }

      await user.save();
      await videos.save();

      return res.status(200).json("Published");
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
    const videoData = videos.flatMap((video) => video);
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
    const Visibility = videos.flatMap((video) =>
      video.VideoData.map((data) => data.visibility)
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
      Visibility,
      videoData,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

Videos.get("/getuservideos/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const video = await videodata.findOne({ email });
    if (!video) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(video.VideoData);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

Videos.get("/getuserimage/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
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
    if (LikedData.length > 0) {
      res.json(LikedData);
    } else {
      res.json("NO DATA");
    }
  } catch (error) {
    res.json(error.message);
  }
});

Videos.post("/watchlater/:id/:email/:email2", async (req, res) => {
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

    const WatchLater = video.VideoData[videoIndex];

    const existingSavedVideo = user.watchLater.find(
      (savedVideo) => savedVideo.savedVideoID === WatchLater._id.toString()
    );

    if (existingSavedVideo) {
      user.watchLater = user.watchLater.filter(
        (savedVideo) => savedVideo.savedVideoID !== WatchLater._id.toString()
      );

      await user.save();
      await video.save();

      return res.json("Removed");
    }

    user.watchLater.push({
      email: email2,
      videoURL: WatchLater.videoURL,
      thumbnailURL: WatchLater.thumbnailURL,
      uploader: WatchLater.uploader,
      ChannelProfile: WatchLater.ChannelProfile,
      Title: WatchLater.Title,
      videoLength: WatchLater.videoLength,
      views: WatchLater.views,
      uploaded_date: WatchLater.uploaded_date,
      savedVideoID: WatchLater._id,
      videoprivacy: WatchLater.visibility,
    });

    await user.save();
    await video.save();
    res.json("Saved");
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
      (data) => data.savedVideoID.toString() === id.toString()
    );

    if (userIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    } else {
      res.json("Found");
    }
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

Videos.get("/checktrending/:videoID/:email", async (req, res) => {
  try {
    const { videoID, email } = req.params;
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

    if (timeDiffHours < 24 && Views >= 50 && !trendingVideo) {
      const trending = new TrendingData({
        email: email,
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

    res.json("DONE");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/gettrendingdata/:videoID", async (req, res) => {
  try {
    const { videoID } = req.params;
    const trending = await TrendingData.findOne({ videoid: videoID });
    if (!trending) {
      return res.status(404).json(false);
    }
    res.json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/gettrending", async (req, res) => {
  try {
    const trending = await TrendingData.find();
    if (trending.length > 0) {
      res.json(trending);
    } else {
      res.json("NO DATA");
    }
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

Videos.post("/addplaylist/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const {
      playlist_name,
      playlist_privacy,
      playlist_date,
      playlist_owner,
      thumbnail,
      title,
      videoID,
      description,
      videolength,
      video_uploader,
      video_date,
      video_views,
      videoprivacy,
    } = req.body;

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

    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const myPlaylists = user.Playlists;
    myPlaylists.push({
      playlist_name,
      owner_email: email,
      playlist_privacy,
      playlist_date,
      playlist_owner,
      playlist_videos: [
        {
          thumbnail,
          title,
          videoID,
          description,
          videolength,
          video_uploader,
          video_date,
          video_views,
          videoprivacy,
        },
      ],
    });

    await user.save();

    res.json(myPlaylists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/getplaylistdata/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const playlists = user.Playlists;

    if (playlists && playlists.length > 0) {
      res.json(playlists);
    } else {
      res.json("No playlists available...");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.post("/addvideotoplaylist/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const {
      Id,
      thumbnail,
      title,
      videoID,
      description,
      videolength,
      video_uploader,
      video_date,
      video_views,
      videoprivacy,
    } = req.body;

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

    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }
    const playlistToUpdate = user.Playlists.find(
      (playlist) => playlist._id.toString() === Id.toString()
    );

    if (!playlistToUpdate) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const isVideoExists = playlistToUpdate.playlist_videos.some(
      (video) => video.videoID === videoID
    );

    if (isVideoExists) {
      return res
        .status(409)
        .json({ error: "Video already exists in the playlist" });
    }

    const newVideo = {
      thumbnail,
      title,
      videoID,
      description,
      videolength,
      video_uploader,
      video_date,
      video_views,
      videoprivacy,
    };

    playlistToUpdate.playlist_videos.push(newVideo);
    await user.save();

    res.status(200).json({ message: "Video added to the playlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/getvideodataplaylist/:email/:videoId", async (req, res) => {
  try {
    const { email, videoId } = req.params;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const playlistsWithVideo = user.Playlists.filter((playlist) =>
      playlist.playlist_videos.some((video) => video.videoID === videoId)
    );

    if (playlistsWithVideo.length === 0) {
      return res.json("Video doesn't exist in any playlist");
    }

    const playlistIdsWithVideo = playlistsWithVideo.map(
      (playlist) => playlist._id
    );

    return res.json(playlistIdsWithVideo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.post("/removevideo/:email/:videoID/:playlistID", async (req, res) => {
  try {
    const { email, videoID, playlistID } = req.params;

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

    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const playlist = user.Playlists.find(
      (playlist) => playlist._id.toString() === playlistID.toString()
    );

    if (!playlist) {
      return res.json("Playlist not found");
    }

    const videoIndex = playlist.playlist_videos.findIndex(
      (video) => video.videoID === videoID
    );

    if (videoIndex === -1) {
      return res.json("Video doesn't exist in the playlist");
    }

    playlist.playlist_videos.splice(videoIndex, 1);

    await user.save();

    res.json("Video removed from the playlist successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/getplaylists/:playlistID", async (req, res) => {
  try {
    const { playlistID } = req.params;
    const user = await userData.findOne({ "Playlists._id": playlistID });

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const myPlaylists = user.Playlists.find(
      (item) => item._id.toString() === playlistID.toString()
    );
    const playlistVideos = myPlaylists.playlist_videos;
    if (playlistVideos && playlistVideos.length > 0) {
      res.json({ playlistVideos, myPlaylists });
    } else {
      res.json({ playlistVideos: "No Playlists Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.post("/saveplaylist/:playlistID", async (req, res) => {
  try {
    const { playlistID } = req.params;
    const { playlist_name } = req.body;

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

    const user = await userData.findOne({ "Playlists._id": playlistID });

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const playlistIndex = user.Playlists.findIndex(
      (item) => item._id.toString() === playlistID.toString()
    );

    if (playlistIndex === -1) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    user.Playlists[playlistIndex].playlist_name = playlist_name;

    await user.save();

    res.json(user.Playlists[playlistIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.post("/deleteplaylist/:playlistID", async (req, res) => {
  try {
    const { playlistID } = req.params;

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

    const user = await userData.findOne({ "Playlists._id": playlistID });

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }
    user.Playlists = user.Playlists.filter(
      (item) => item._id.toString() !== playlistID.toString()
    );
    await user.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.post("/saveplaylistprivacy/:playlistID", async (req, res) => {
  try {
    const { playlistID } = req.params;
    const { privacy } = req.body;

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

    const user = await userData.findOne({ "Playlists._id": playlistID });

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const playlistIndex = user.Playlists.findIndex(
      (item) => item._id.toString() === playlistID.toString()
    );

    if (playlistIndex === -1) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    user.Playlists[playlistIndex].playlist_privacy = privacy;

    await user.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.post("/addotherplaylist/:playlistID/:email", async (req, res) => {
  try {
    const { playlistID, email } = req.params;

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

    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const checkPlaylistAvailability = user.savedPlaylists.find(
      (item) => item.playlistID.toString() === playlistID.toString()
    );

    if (!checkPlaylistAvailability) {
      user.savedPlaylists.push({ playlistID: playlistID });
      await user.save();
      res.json("Saved");
    } else {
      user.savedPlaylists = user.savedPlaylists.filter(
        (item) => item.playlistID !== playlistID.toString()
      );
      await user.save();

      res.json("Removed");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/getsavedplaylist/:playlistID/:email", async (req, res) => {
  try {
    const { playlistID, email } = req.params;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const checkPlaylistAvailability = user.savedPlaylists.find(
      (item) => item.playlistID.toString() === playlistID.toString()
    );
    if (!checkPlaylistAvailability) {
      res.json("Not Found");
    } else {
      res.json("Found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Videos.get("/getsavedplaylist/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });
    const AllUsers = await userData.find();

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const savedPlaylistIDs = user.savedPlaylists.map(
      (playlist) => playlist.playlistID
    );

    const matchingPlaylists = [];

    // Iterate through all users and their playlists
    AllUsers.forEach((currentUser) => {
      const playlistsForUser = currentUser.Playlists.filter((playlist) =>
        savedPlaylistIDs.includes(playlist._id.toString())
      );
      matchingPlaylists.push(...playlistsForUser);
    });

    res.json(matchingPlaylists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = Videos;
