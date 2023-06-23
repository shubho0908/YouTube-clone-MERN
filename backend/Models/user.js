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
        required: true,
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
        required: true,
      },
      Title: {
        type: String,
        required: true,
      },
      uploader: {
        type: String,
        required: true,
      },
    },
  ],
  channelData: [
    {
      subscribers: {
        type: Number,
      },
      totalVideos: {
        type: Number,
      },
    },
  ],
});

const user = mongoose.model("userData", UserData);

module.exports = user;
