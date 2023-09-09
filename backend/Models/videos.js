const mongoose = require("mongoose");
const validator = require("validator");

const Comment = new mongoose.Schema({
  username: {
    type: String,
  },
  user_profile: {
    type: String,
  },
  comment: {
    type: String,
  },
  videoid: {
    type: String,
  },
  time: {
    type: String,
  },
  likes: {
    type: Number,
  },
  user_email: {
    type: String,
  },
  channel_id: {
    type: String,
  },
  heartComment: {
    type: Boolean,
    default: false,
  },
});

const VideoData = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    },
  },
  VideoData: [
    {
      thumbnailURL: {
        type: String,
        required: true,
      },
      uploader: {
        type: String,
        required: true,
      },
      videoURL: {
        type: String,
        required: true,
      },
      ChannelProfile: {
        type: String,
        required: true,
      },
      Title: {
        type: String,
        required: true,
      },
      Description: {
        type: String,
        required: true,
      },
      Tags: {
        type: String,
        required: true,
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
      visibility: {
        type: String,
        default: "Public",
      },
      likes: {
        type: Number,
        default: 0,
      },
      comments: [Comment],
    },
  ],
});

const VideoDataModel = mongoose.model("VideoData", VideoData);

module.exports = VideoDataModel;
