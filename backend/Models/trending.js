const mongoose = require("mongoose");
const validator = require("validator");

const TrendingData = new mongoose.Schema({
  thumbnailURL: {
    type: String,
    required: true,
  },
  trendingNo: {
    type: Number,
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
  videoid: {
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
});

const TrendingDataModel = mongoose.model("TrendingData", TrendingData);

module.exports = TrendingDataModel;
