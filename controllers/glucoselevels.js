const express = require('express');
const { glucoseLevelsModel } = require("../models/glucoselevels");
const { userModel } = require("../models/users");
const { validGlucoseLevels } = require("../validations/glucoselevels");

// const validDate = (month, year,day) =>{
//     let date ={
//         ok: true,
//         prevYear: '', 
//         prevMonth: '', 
//         prevDay: ''
//     }

//     if (month == 12) {
//         date.prevMonth = 1; 
//         date.prevYear = year-1;
//         date.prevDay = dayInMonth(date.prevMonth, date.prevYear);
//         let dy = new Date(`${date.prevYear},${date.prevMonth},${date.prevDay}`);  
//         console.log(dy);
//         date.prevDay = date.prevDay + dayWeekBefor; // day+(-day)
//     }
//     else {
//         prevMonth = month-1;
//         console.log(prevMonth);
//         prevYear = d.getFullYear(); //prevYear
//         prevDay = dayInMonth(prevMonth, year);
//         console.log(prevDay);
//         let dy = new Date(`${year},${prevMonth},${prevDay}`);
//         console.log(dy);
//         dayWeekBefor = dy.getDate() + dayWeekBefor; // day+(-day)
//         console.log(dayWeekBefor);

//     }


// }

const dayInMonth = (month, year) => {
    switch (month) {
        case 1:
            return 30;
            break;
        case 2: //every 4 years the day is 29 
            if (year % 4 == 0) return 29;
            else return 28;
            break;
        case 3:
            return 31;
            break;
        case 4:
            return 30;
            break;
        case 5:
            return 31;
            break;
        case 6:
            return 30;
            break;
        case 7:
            return 31;
            break;
        case 8:
            return 31;
            break;
        case 9:
            return 30;
            break;
        case 10:
            return 31;
            break;
        case 11:
            return 30;
            break;
        case 12:
            return 31;
            break;
        default:
            break;
    }
}

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
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var yesterday = d.getDate() - 1;
        console.log(new Date(`${year},${month},${yesterday}`));

        glucoseLevelsModel.find({ date_time: { '$gte': new Date(`${year},${month},${yesterday}`) } })
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

const getWeeklyGlucose = (req, res) => {
    try {
        let d = new Date();
        let day = d.getDate() + 1;//+1 is for including the this day 
        let year = d.getFullYear();
        let month = d.getMonth() + 1;//+1 becouse day of date() starts from 0 .
        let dayWeekBefor = d.getDate() - 7 + 1; // minus 7 days from tody (a week) +1 is for including the 7th day 
        let prevYear = year, prevMonth = month, prevDay = day;

        console.log(month);
        console.log(dayWeekBefor);

        //chack if minus 7 days is valid and set vars 
        if (dayWeekBefor < 1) {
            //check valid moth 
            if (month == 12) {
                prevMonth = 1; //prevMonth
                prevYear = d.getFullYear() - 1; //prevYear
                prevDay = dayInMonth(prevMonth, prevYear);
                let dy = new Date(`${prevYear},${prevMonth},${prevDay}`);
                console.log(dy);
                dayWeekBefor = dy.getDate() + dayWeekBefor + 1; // day+(-day) +1 is for including the 7th day 
            }
            else {
                prevMonth = month - 1;
                console.log(prevMonth);
                prevYear = d.getFullYear(); //prevYear
                prevDay = dayInMonth(prevMonth, year);
                console.log(prevDay);
                let dy = new Date(`${year},${prevMonth},${prevDay}`);
                console.log(dy);
                dayWeekBefor = dy.getDate() + dayWeekBefor + 1; // day+(-day) +1 is for including the 7th day 
                console.log(dayWeekBefor);
            }
        }
        //if not then chang month and days
        console.log(`${year}-${month}-${day}`);
        console.log(new Date(`${prevYear},${prevMonth},${dayWeekBefor}`));

        glucoseLevelsModel.find({ date_time: { '$lte': new Date(`${year},${month},${day}`), '$gte': new Date(`${prevYear},${prevMonth},${dayWeekBefor}`) } })
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

const getMontlyGlucose = (req, res) => {
    try {
        let d = new Date();
        let day = d.getDate();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let monthBefor = d.getMonth();
        let prevYear = year;

        console.log(month);
        console.log(monthBefor);

        //chack if moth is 1 then set the month and year 
        if (month == 1) {
            monthBefor = 12;
            prevYear = prevYear - 1;
        }
        console.log(new Date(`${prevYear},${monthBefor},${day}`));

        glucoseLevelsModel.find({ date_time: { '$lte': new Date(`${year},${month},${day}`), '$gte': new Date(`${prevYear},${monthBefor},${day}`) } })
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

const getAnnualGlucose = (req, res) => {
    try {
        let d = new Date();
        let day = d.getDate();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let yearBefor = d.getFullYear() - 1;


        console.log(new Date(`${yearBefor},${month},${day}`));

        glucoseLevelsModel.find({ date_time: { '$lte': new Date(`${year},${month},${day}`), '$gte': new Date(`${yearBefor},${month},${day}`) } })
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


//time of today only!!! 1, 3,6,9 hours 
// const getGlucoseByTime = (req, res) => {
//     try {
//         let time = req.params.time;
//         let d = new Date();
//         let day = d.getDate();
//         let year = d.getFullYear();
//         let month = d.getMonth() + 1;
//         //get curr time:
//         let hours = d.getHours();
//         let minutes = d.getMinutes();

//         let hourBefor = hours - req.params.time;
//         console.log(hours);
//         console.log(hourBefor);

//         var ddd = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
//         var d3 = new Date("2015-03-25T12:00:00Z")
//         console.log(d3);

//         console.log(new Date(`${year},${month},${day}, ${hours}, ${minutes}, 00`));

//         glucoseLevelsModel.find({ date_time: { '$lte': new Date(`${year},${month},${day}, ${hours}`), '$gte': new Date(`${year},${month},${day}, ${hourBefor}`) } })
//             .then(data => {
//                 res.json(data);
//             })
//             .catch(err => {
//                 res.status(400).json(err.message);
//             })
//     }
//     catch (err) {
//         res.status(500).json({
//             status: 500,
//             message: err.message,
//         })
//     }
// }


const getHighGlucose = (req, res) => {
    try {
        glucoseLevelsModel.find({ user: req._id, type: 'high' })
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
        glucoseLevelsModel.find({ user: req._id, type: 'low' }).sort({ date_time: -1 })
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


//for doctors or friends
const getCurrGlucoseOfUser = (req, res) => {
    try {
        userModel.findOne({ _id: req._id }).populate('patients friends', 'user')
            .then(data => {
                if (data.rule == 'doctor' && data.patients) {
                    let found = userModel.findOne({ _id: req._id, patients: req.params.id }).populate('patients', 'user email');
                    if (found) {
                        glucoseLevelsModel.findOne({ user: req.params.id }).sort({ date_time: -1 })
                            .then(data => {
                                res.json(data);
                            })
                            .catch(err => {
                                res.status(400).json(err.message);
                            })
                    }
                    else
                        res.status(401).json("doctor is not authrized accses");
                }
                else if (data.rule == 'regular' && data.friends) {
                    //check if user have friends 
                    let foundFriend = userModel.findOne({ _id: req._id, friends: req.params.id }).populate('friends', 'user email');
                    if (foundFriend) {
                        glucoseLevelsModel.findOne({ user: req.params.id }).sort({ date_time: -1 })
                            .then(data => {
                                res.json(data);
                            })
                            .catch(err => {
                                res.status(400).json(err.message);
                            })
                    }
                    else
                        res.status(401).json("user not authrized accses");
                }
                else
                    res.status(401).json("user is not authrized to see detailes");
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

const getHighGlucoseOfUser = async (req, res) => {
    try {
        userModel.findOne({ _id: req._id }).populate('patients', 'user')
            .then(data => {
                console.log(data);
                if (data.rule == 'doctor' && data.patients) {
                    let found = userModel.findOne({ _id: req._id, patients: req.params.id }).populate('patients', 'user email');
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
                else if (data.rule == 'regular' && data.friends) {
                    let foundFriend = userModel.findOne({ _id: req._id, friends: req.params.id }).populate('friends', 'user email');
                    if (foundFriend) {
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

const getLowGlucoseOfUser = async (req, res) => {
    try {
        userModel.findOne({ _id: req._id }).populate('patients', 'user')
            .then(data => {
                if (data.rule == 'doctor' && data.patients) {
                    let found = userModel.findOne({ _id: req._id, patients: req.params.id }).populate('patients', 'user email');
                    if (found) {
                        glucoseLevelsModel.find({ user: req.params.id, type: 'low' }).sort({ date_time: -1 })
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
                else if (data.rule == 'regular' && data.friends) {
                    let foundFriend = userModel.findOne({ _id: req._id, friends: req.params.id }).populate('friends', 'user email');
                    if (foundFriend) {
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

const getDaylyGlucoseOfUser = async (req, res) => {
    let d = new Date();
    var day = d.getDate();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var yesterday = d.getDate() - 1;
    console.log(new Date(`${year},${month},${yesterday}`));

    try {
        userModel.findOne({ _id: req._id }).populate('patients', 'user')
            .then(data => {
                if (data.rule == 'doctor' && data.patients) {
                    let found = userModel.findOne({ _id: req._id, patients: req.params.id }).populate('patients', 'user email');
                    if (found) {
                        glucoseLevelsModel.find({ user: req.params.id, date_time: { '$gte': new Date(`${year},${month},${yesterday}`) } })
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
                else if (data.rule == 'regular' && data.friends) {
                    let foundFriend = userModel.findOne({ _id: req._id, friends: req.params.id }).populate('friends', 'user email');
                    if (foundFriend) {
                        glucoseLevelsModel.find({ user: req.params.id, date_time: { '$gte': new Date(`${year},${month},${yesterday}`) } })
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

const getWeeklyGlucoseOfUser = async (req, res) => {
    let d = new Date();
    let day = d.getDate() + 1;//+1 is for including the this day 
    let year = d.getFullYear();
    let month = d.getMonth() + 1;//+1 becouse day of date() starts from 0 .
    let dayWeekBefor = d.getDate() - 7 + 1; // minus 7 days from tody (a week) +1 is for including the 7th day 
    let prevYear = year, prevMonth = month, prevDay = day;

    //chack if minus 7 days is valid and set vars 
    if (dayWeekBefor < 1) {
        //check valid moth 
        if (month == 12) {
            prevMonth = 1; //prevMonth
            prevYear = d.getFullYear() - 1; //prevYear
            prevDay = dayInMonth(prevMonth, prevYear);
            let dy = new Date(`${prevYear},${prevMonth},${prevDay}`);
            console.log(dy);
            dayWeekBefor = dy.getDate() + dayWeekBefor + 1; // day+(-day) +1 is for including the 7th day 
        }
        else {
            prevMonth = month - 1;
            console.log(prevMonth);
            prevYear = d.getFullYear(); //prevYear
            prevDay = dayInMonth(prevMonth, year);
            console.log(prevDay);
            let dy = new Date(`${year},${prevMonth},${prevDay}`);
            console.log(dy);
            dayWeekBefor = dy.getDate() + dayWeekBefor + 1; // day+(-day) +1 is for including the 7th day 
            console.log(dayWeekBefor);
        }
    }

    try {
        userModel.findOne({ _id: req._id }).populate('patients', 'user')
            .then(data => {
                if (data.rule == 'doctor' && data.patients) {
                    let found = userModel.findOne({ _id: req._id, patients: req.params.id }).populate('patients', 'user email');
                    if (found) {
                        glucoseLevelsModel.find({ user: req.params.id, date_time: { '$lte': new Date(`${year},${month},${day}`), '$gte': new Date(`${prevYear},${prevMonth},${dayWeekBefor}`) } })
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
                else if (data.rule == 'regular' && data.friends) {
                    let foundFriend = userModel.findOne({ _id: req._id, friends: req.params.id }).populate('friends', 'user email');
                    if (foundFriend) {
                        glucoseLevelsModel.find({ user: req.params.id, date_time: { '$lte': new Date(`${year},${month},${day}`), '$gte': new Date(`${prevYear},${prevMonth},${dayWeekBefor}`) } })
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

const getMontlyGlucoseOfUser = async (req, res) => {
    let d = new Date();
    let day = d.getDate();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let monthBefor = d.getMonth();
    let prevYear = year;

    //chack if moth is 1 then set the month and year 
    if (month == 1) {
        monthBefor = 12;
        prevYear = prevYear - 1;
    }

    try {
        userModel.findOne({ _id: req._id }).populate('patients', 'user')
            .then(data => {
                if (data.rule == 'doctor' && data.patients) {
                    let found = userModel.findOne({ _id: req._id, patients: req.params.id }).populate('patients', 'user email');
                    if (found) {
                        glucoseLevelsModel.find({ user: req.params.id, date_time: { '$lte': new Date(`${year},${month},${day}`), '$gte': new Date(`${prevYear},${monthBefor},${day}`) } })
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
                else if (data.rule == 'regular' && data.friends) {
                    let foundFriend = userModel.findOne({ _id: req._id, friends: req.params.id }).populate('friends', 'user email');
                    if (foundFriend) {
                        glucoseLevelsModel.find({ user: req.params.id, date_time: { '$lte': new Date(`${year},${month},${day}`), '$gte': new Date(`${prevYear},${monthBefor},${day}`) } })
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

const getAnnualGlucoseOfUser = async (req, res) => {
    let d = new Date();
    let day = d.getDate();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let yearBefor = d.getFullYear() - 1;

    try {
        userModel.findOne({ _id: req._id }).populate('patients', 'user')
            .then(data => {
                if (data.rule == 'doctor' && data.patients) {
                    let found = userModel.findOne({ _id: req._id, patients: req.params.id }).populate('patients', 'user email');
                    if (found) {
                        glucoseLevelsModel.find({user: req.params.id, date_time: { '$lte': new Date(`${year},${month},${day}`), '$gte': new Date(`${yearBefor},${month},${day}`) } })
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
                else if (data.rule == 'regular' && data.friends) {
                    let foundFriend = userModel.findOne({ _id: req._id, friends: req.params.id }).populate('friends', 'user email');
                    if (foundFriend) {
                        glucoseLevelsModel.find({user: req.params.id, date_time: { '$lte': new Date(`${year},${month},${day}`), '$gte': new Date(`${yearBefor},${month},${day}`) } })
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
    getWeeklyGlucose,
    getMontlyGlucose,
    getAnnualGlucose,
    //getGlucoseByTime,
    getHighGlucose,
    getLowGlucose,

    // //use of the doctor or friend 
    getCurrGlucoseOfUser,
    getDaylyGlucoseOfUser,
    getWeeklyGlucoseOfUser,
    getMontlyGlucoseOfUser,
    getAnnualGlucoseOfUser,
    // getGlucoseByTimeOfUser,
    getHighGlucoseOfUser,
    getLowGlucoseOfUser,

    //post for the user only 
    glucoseLevel
};