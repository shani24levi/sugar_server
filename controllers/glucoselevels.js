const express = require('express');
const { glucoseLevelsModel } = require("../models/glucoselevels");
const { userModel } = require("../models/users");
const { validGlucoseLevels } = require("../validations/glucoselevels");


const getCurrGlucose = (req, res) => {
    try {
        glucoseLevelsModel.findOne().sort({ date_time: -1 })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(400).json(err.message);
            })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}

const glucoseLevel = async (req, res) => {
    try {
        let valid = validGlucoseLevels(req.body);
        if (!valid.error) {
            try {
                //check if the user exixt for id_user
                userModel.find({ _id: req._id }, async (err, data) => {
                    if (data.length == 0) { // 1 meens found a match 
                        res.status(400).json({ message: "User not found" });
                    }
                    else {
                        //user found and push a glucose level for the user
                        console.log('adding');
                        req.body.user = req._id;
                        console.log(req.body);
                        let data = await glucoseLevelsModel.insertMany([req.body]);
                        res.json(data);
                    }
                });
            }
            catch (err) {
                res.status(400).json(err.message);
            }
        }
        else {
            res.status(400).json(valid.error.details);
        }
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}

const getDaylyGlucose = (req, res) => {
    try {
        let d = new Date();
        var day = d.getDate();
        glucoseLevelsModel.find({ date_time: day }).sort({ date_time: -1 })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(400).json(err.message);
            })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}

const getHighGlucose = (req, res) => {
    try {
        glucoseLevelsModel.find({ user: req._id , type: 'high'})
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(400).json(err.message);
            })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}

const getLowGlucose = (req, res) => {
    try {
        glucoseLevelsModel.find({user: req._id, type: 'low' }).sort({ date_time: -1 })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(400).json(err.message);
            })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}

const getHighGlucoseOfUser = async(req, res) => {
    try {
        userModel.findOne({ _id: req._id }).populate('patients', 'user')
            .then(data => {
                if (data.rule == 'doctor' && data.patients) {
                    let found = userModel.findOne({ _id: req._id, patients: req.params.id}).populate('patients', 'user email');
                    if (found) {
                        glucoseLevelsModel.find({ user: req.params.id, type: 'high' }).sort({ date_time: -1 })
                            .then(data => {
                                res.json(data);
                            })
                            .catch(err => {
                                res.status(400).json(err.message);
                            })
                    }
                    else
                        res.status(404).json("user not authrized accses");
                }
                // else if (data.rule == 'regular' && data.friends) {
                //     const found = data.friends.find(element => element == req.params.id);
                //     if (found) {
                //         glucoseLevelsModel.find({ user: req.params.id, type: 'high' }).sort({ date_time: -1 })
                //             .then(data => {
                //                 res.json(data);
                //             })
                //             .catch(err => {
                //                 res.status(400).json(err.message);
                //             })
                //     }
                //     else
                //         res.status(404).json("user not authrized accses");
                // }
                else
                    res.status(404).json("user is not authrized to see detailes");
            })
            .catch(err => { res.status(400).json(err); })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}
module.exports = {
    //use of the user
    getCurrGlucose,
    getDaylyGlucose,
    // getWeeklyGlucose,
    // getMontlyGlucose,
    // getAnnualGlucose,
    // getGlucoseByTime,
    getHighGlucose,
    getLowGlucose,

    // //use of the doctor or friend 
    // getCurrGlucoseOfUser,
    // getDaylyGlucoseOfUser,
    // getWeeklyGlucoseOfUser,
    // getMontlyGlucoseOfUser,
    // getAnnualGlucoseOfUser,
    // getGlucoseByTimeOfUser,
    getHighGlucoseOfUser,
    // getLowGlucoseOfUser,

    //post for the user only 
    glucoseLevel
};