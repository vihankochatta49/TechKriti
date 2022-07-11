const mongoose = require("mongoose");

//schema for models
const imgSchema = new mongoose.Schema({
  name: String,
  title: String,
  points: { type: Number, default: 0 },
  filename: String,
  contentType: String,
  imageBase64: String,
});

module.exports = new mongoose.model("Image", imgSchema);
