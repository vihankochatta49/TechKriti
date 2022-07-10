const mongoose = require("mongoose");
const slugify = require("slugify");
var findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  name: String,
  slugName: String,
  email: String,
  password: String,
  password2: String,
  provider: String,
  emailID: String,
  phone: Number,
  college: String,
});

userSchema.pre("validate", function (next) {
  if (this.name) {
    this.slugName = slugify(this.name);
  }
  next();
});

userSchema.plugin(findOrCreate);

module.exports = new mongoose.model("userAuth", userSchema);
