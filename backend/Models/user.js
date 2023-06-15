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
    },
  ],
  likedVideos: [
    {
      videoURL: {
        type: String,
      },
      thumnailURL: {
        type: String,
      },
    },
  ],
});

const user = mongoose.model("userData", UserData);

module.exports = user;
