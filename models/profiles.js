const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    glucoses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'glucoses' }],
    nutritions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'nutritions' }],
    alerms:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'alerms' }],

    glucose_type: String,
    age: Number,
    weight: Number,
    sex: String,
    pregnancy: { type:Boolean, default: false},
    medications: Array,
    diseases: Array,

});
const profileModel = mongoose.model("profiles", profileSchema);
exports.profileModel = profileModel;
