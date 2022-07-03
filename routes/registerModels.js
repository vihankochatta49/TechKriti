const mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  password2: String,
  provider: String,
});

userSchema.plugin(findOrCreate);

module.exports = new mongoose.model("userAuth", userSchema);
