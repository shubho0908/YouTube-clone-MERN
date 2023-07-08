const mongoose = require("mongoose");
const validator = require("validator");

const UserData = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  hasChannel: {
    type: Boolean,
    default: false,
  },
  channelName: {
    type: String,
  },
  thumbnails: [
    {
      imageURL: {
        type: String,
      },
    },
  ],
  videos: [
    {
      videoURL: {
        type: String,
      },
      videoLength: {
        type: Number,
        required: true,
      },
    },
  ],
  likedVideos: [
    {
      videoURL: {
        type: String,
      },
      thumbnailURL: {
        type: String,
      },
      videoLength: {
        type: Number,
      },
      views: {
        type: Number,
        default: 0,
      },
      uploaded_date: {
        type: String,
      },
      ChannelProfile: {
        type: String,
      },
      Title: {
        type: String,
      },
      uploader: {
        type: String,
      },
      likedVideoID: {
        type: String,
      },
    },
  ],
  likedComments: [
    {
      comment_ID: {
        type: String,
      },
    },
  ],
  watchLater: [
    {
      videoURL: {
        type: String,
      },
      thumbnailURL: {
        type: String,
      },
      videoLength: {
        type: Number,
      },
      views: {
        type: Number,
        default: 0,
      },
      uploaded_date: {
        type: String,
      },
      ChannelProfile: {
        type: String,
      },
      Title: {
        type: String,
      },
      uploader: {
        type: String,
      },
      savedVideoID: {
        type: String,
      },
    },
  ],
  channelData: [
    {
      subscribers: {
        type: Number,
        default: 0,
      },
      channelName: {
        type: String,
      },
      channelDescription: {
        type: String,
      },
      channelProfile: {
        type: String,
      },
      joinedDate: {
        type: String,
      },
    },
  ],
});

const user = mongoose.model("userData", UserData);

module.exports = user;
