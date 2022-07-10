const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  points: Number,
  startDate: Date,
  endDate: Date,
});

module.exports = new mongoose.model("event", eventSchema);
