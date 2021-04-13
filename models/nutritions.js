const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    glucose: { type: mongoose.Schema.Types.ObjectId, ref: 'glucoses' }, 
    type: String, 
    title: String,
    description: String,
    date: { type: Date, default: Date.now} //in what time i ate the food
});
const nutritionModel = mongoose.model("nutritions", nutritionSchema);
exports.nutritionModel = nutritionModel;