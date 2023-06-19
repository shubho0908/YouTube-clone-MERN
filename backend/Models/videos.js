const mongoose = require("mongoose");
const validator = require("validator");

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
        required:true
      },
    },
  ],
});

const videodata = mongoose.model("videodata", VideoData);

module.exports = videodata;
