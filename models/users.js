const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user: String,
  email: String,
  pass: String,
  avatar: String,
  date_time: {
    type: Date, default: Date.now
  },
  rule:{
    type:String, default:"regular"
  },
  patients:[{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }] //only if user.role is 'doctor'
});
const userModel = mongoose.model("users",userSchema);
exports.userModel = userModel;
