const mongoose = require("mongoose");

const massageSchema = new mongoose.Schema({
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },//the pationt 
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },  //doctor only 
    type: String, //new massage or reply to a massage
    title: String,
    content: String,
    status: String, //open or closed
    urgency:  { type: Boolean, default: false}, //true meens importent massge from doctor!
    date: { type: Date, default: Date.now},
    reply:  { type: Boolean, default: false}, // doctor can chose if he wants a reply for his massage
});
const massageModel = mongoose.model("alerms", massageSchema);
exports.massageModel = massageModel;