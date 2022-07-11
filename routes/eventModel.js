const mongoose = require("mongoose");

//schema for events
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  points: Number,
  startDate: Date,
  startedAt: String,
  endDate: Date,
  endedAt: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

eventSchema.pre("validate", function (next) {
  if (this.startDate) {
    //changing date format
    var tarikh = new Date(this.startDate);
    var d = tarikh.getDate();
    var m = tarikh.getMonth() + 1;
    var y = tarikh.getFullYear();
    this.startedAt = d + "/" + m + "/" + y;
  }
  if (this.endDate) {
    //changing date format
    var tarikh1 = new Date(this.endDate);
    var d = tarikh1.getDate();
    var m = tarikh1.getMonth() + 1;
    var y = tarikh1.getFullYear();
    this.endedAt = d + "/" + m + "/" + y;
  }
  next();
});

module.exports = new mongoose.model("event", eventSchema);
