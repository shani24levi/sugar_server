const mongoose = require("mongoose");

const alermSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    glucose: { type: mongoose.Schema.Types.ObjectId, ref: 'glucoses' },  //Alert by glucose level
    title: String,
    status: String, // on/off
    date: { type: Date, default: Date.now}
});
const alermModel = mongoose.model("alerms", alermSchema);
exports.alermModel = alermModel;
