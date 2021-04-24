const mongoose = require("mongoose");

const glucoseLevelsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    returning_light_intensity: String,
    concentration: Number,
    glucose_level: Number,
    type: String,                                   //high, low, normal, pre-low , pre-high
    date_time: { type: Date, default: Date.now}   // includes: year, month, day, hours, minutes, seconds, milliseconds
});
const glucoseLevelsModel = mongoose.model("glucoselevels", glucoseLevelsSchema);
exports.glucoseLevelsModel = glucoseLevelsModel;
