require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const TrendingData = require("../Models/trending");
const cookieParser = require("cookie-parser");
const { generateAccessToken, verifyRefreshToken } = require("../lib/tokens");
const Channel = express.Router();

Channel.use(cookieParser());

Channel.get("/getchannel/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    } else {
      const hasChannel = user?.hasChannel;
      const userProfile = user?.profilePic;
      const ChannelName = user?.channelName;
      res.status(200).json({
        hasChannel,
        userProfile,
        ChannelName,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

Channel.get("/getcover/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    const coverimg = user.channelData[0].channelCoverImg;
    if (!coverimg) {
      return res.status(200).json("No data");
    }

    return res.status(200).json(coverimg);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

Channel.get("/getchannelid/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    if (user?.hasChannel) {
      const channelID = user.channelData[0]._id;
      const channelDescription = user.channelData[0].channelDescription;
      const subscribers = user.channelData[0].subscribers;
      const links = user.channelData[0].socialLinks;
      res
        .status(200)
        .json({ channelID, subscribers, channelDescription, links });
    } else {
      return res.status(404).json({
        message: "USER DOESN'T HAVE CHANNEL",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

Channel.get("/getsubscribers/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    } else {
      const subscribers = user.channelData[0].subscribers;
      res.status(200).json(subscribers);
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

Channel.post("/savechannel", async (req, res) => {
  try {
    const {
      email,
      ChannelName,
      ChannelAbout,
      fblink,
      instalink,
      twitterlink,
      websitelink,
      profileURL,
      currentDate,
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
              channelDescription: ChannelAbout,
              joinedDate: currentDate,
              socialLinks: [
                {
                  facebook: fblink,
                  instagram: instalink,
                  twitter: twitterlink,
                  website: websitelink,
                },
              ],
            },
          ],
        },
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    return res.status(201).json({
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
    const channelname = user.channelName;

    if (!channelname) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    return res.status(200).json(channelname);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// PERSONAL CHANNEL DATA

Channel.get("/getuservideos/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const videos = await videodata.findOne({ email });
    if (!videos) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    const myvideos = videos.VideoData;
    res.status(200).json(myvideos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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
      return res.status(404).json({ error: "User not found" });
    }

    const channelData = user.channelData.find(
      (channel) => channel._id.toString() === id
    );

    if (!channelData) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const userEmail = user.email;

    res.json(userEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Channel.get("/subscribe/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });

    if (!user) {
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

    return res.status(200).json(YoutuberData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

Channel.post("/subscribe/:channelID/:email/:email2", async (req, res) => {
  try {
    const { channelID, email, email2 } = req.params;
    const { youtuberName, youtuberProfile, youtubeChannelID } = req.body;

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
    const user2 = await userData.findOne({ email: email2 });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user2) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add validation checks for youtubeChannelID and channelID
    if (!youtubeChannelID || !channelID) {
      return res.status(400).json({ error: "Invalid channel ID" });
    }

    const existingChannelIndex = user.subscribedChannels.findIndex(
      (channel) => channel.channelID.toString() === channelID.toString()
    );

    if (existingChannelIndex === -1) {
      user.subscribedChannels.push({
        channelname: youtuberName,
        channelProfile: youtuberProfile,
        channelID: youtubeChannelID.toString(),
      });
      user2.channelData[0].subscribers += 1;
      res.status(201).json("Subscribed");
    } else {
      user.subscribedChannels.splice(existingChannelIndex, 1);
      user2.channelData[0].subscribers -= 1;
      res.status(200).json("Unsubscribed");
    }

    await user.save();
    await user2.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Channel.get("/getsubscriptions/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const subscribedData = user.subscribedChannels;
    if (subscribedData.length > 0) {
      return res.status(200).json(subscribedData);
    } else {
      return res.status(200).json({ subscribedData: "NO DATA" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

Channel.get("/getsubscriptionid/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const subscribedChannels = user.subscribedChannels;
    for (let i = 0; i < subscribedChannels.length; i++) {
      const channel = subscribedChannels[i];
      const channelID = channel.channelID;
      res.status(200).json(channelID);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Channel.get("/checksubscription/:channelID/:email", async (req, res) => {
  try {
    const { channelID } = req.params;
    const email = req.params.email;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingChannelID = user.subscribedChannels.find(
      (channel) => channel.channelID.toString() === channelID
    );

    if (existingChannelID === undefined) {
      return res.status(200).json({ message: false });
    } else {
      res.status(200).json({ message: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Channel.get("/getabout/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const channeldata = user.channelData[0];
    const description = channeldata.channelDescription;
    const sociallinks = channeldata.socialLinks;
    const joining = channeldata.joinedDate;
    res.status(200).json({ description, sociallinks, joining });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Channel.post("/savefeaturedchannel/:email", async (req, res) => {
  try {
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

    const user = await userData.findOne({ email });
    const data = req.body;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const featuredChannelData = user.featuredChannels;

    const channelExists = featuredChannelData.some(
      (channel) => channel.channelID === data.channelID
    );

    if (channelExists) {
      return res.status(200).json("Channel added already");
    }

    featuredChannelData.push({
      channelname: data.channelname,
      channelProfile: data.channelProfile,
      channelID: data.channelID,
    });

    await user.save();
    res.status(200).json(featuredChannelData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Channel.get("/getfeaturedchannels/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const featuredChannelData = user.featuredChannels;

    if (featuredChannelData.length > 0) {
      res.status(200).json(featuredChannelData);
    } else {
      res.status(200).json("No channels");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Channel.post("/deletefeaturedchannel/:email/:channelid", async (req, res) => {
  try {
    const { email, channelid } = req.params;

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
      return res.status(404).json({ error: "User not found" });
    }

    const featuredChannelData = user.featuredChannels;

    const updatedFeaturedChannels = featuredChannelData.filter(
      (channel) => channel.channelID !== channelid
    );

    user.featuredChannels = updatedFeaturedChannels;

    await user.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Channel.post("/savecustomization/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { profileURL, coverURL, channelid } = req.body;

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
    const video = await videodata.findOne({ user_email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!video) {
      return res.status(404).json({ error: "Video data not found" });
    }

    user.profilePic = profileURL;
    user.channelData[0].channelProfile = profileURL;
    user.channelData[0].channelCoverImg = coverURL;

    await userData.updateMany(
      { "subscribedChannels.channelID": channelid },
      {
        $set: {
          "subscribedChannels.$.channelProfile": profileURL,
        },
      }
    );

    await userData.updateMany(
      { "featuredChannels.channelID": channelid },
      {
        $set: {
          "featuredChannels.$.channelProfile": profileURL,
        },
      }
    );

    video.VideoData.forEach((item) => {
      item.ChannelProfile = profileURL;
    });

    await videodata.updateMany(
      { "VideoData.comments.user_email": email },
      {
        $set: {
          "VideoData.$[video].comments.$[comment].user_profile": profileURL,
        },
      },
      {
        arrayFilters: [
          { "video.comments.user_email": email },
          { "comment.user_email": email },
        ],
      }
    );

    await user.save();
    await video.save();

    res.json({ success: true, userData: user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

Channel.post("/updatechanneldata/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { channelName, channelDescription, channelID } = req.body;

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
    const video = await videodata.findOne({ email });
    const trending = await TrendingData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.channelName = channelName;
    user.channelData[0].channelName = channelName;
    user.channelData[0].channelDescription = channelDescription;

    user.Playlists.forEach((element) => {
      element.playlist_owner = channelName;
    });

    await userData.updateMany(
      { "Playlists.owner_email": email },
      {
        $set: {
          "Playlists.$[playlist].playlist_owner": channelName,
        },
      },
      {
        arrayFilters: [{ "playlist.owner_email": email }],
      }
    );

    await userData.updateMany(
      { "subscribedChannels.channelID": channelID },
      {
        $set: {
          "subscribedChannels.$.channelname": channelName,
        },
      }
    );

    await userData.updateMany(
      { "featuredChannels.channelID": channelID },
      {
        $set: {
          "featuredChannels.$.channelname": channelName,
        },
      }
    );

    await userData.updateMany(
      { "likedVideos.email": email },
      {
        $set: {
          "likedVideos.$.uploader": channelName,
        },
      }
    );

    await userData.updateMany(
      { "watchLater.email": email },
      {
        $set: {
          "watchLater.$.uploader": channelName,
        },
      }
    );

    await user.save();

    if (!video) {
      return res.status(404).json({ error: "Video data not found" });
    }

    video.VideoData.forEach((item) => {
      item.uploader = channelName;
    });

    await videodata.updateMany(
      { "VideoData.comments.user_email": email },
      {
        $set: {
          "VideoData.$[video].comments.$[comment].username": channelName,
        },
      },
      {
        arrayFilters: [
          { "video.comments.user_email": email },
          { "comment.user_email": email },
        ],
      }
    );

    await video.save();

    if (trending) {
      trending.uploader = channelName; // Update the uploader field in trending data
      await trending.save();
    }

    res.json("DONE");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = Channel;
