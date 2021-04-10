const express = require('express');
const { profileModel } = require("../models/profiles");
const { userModel } = require("../models/users");
const { validProfile,validEditProfile } = require("../validations/profiles");


const createProfile = async (req, res) => {
  try {
    let valid = validProfile(req.body);
    if (!valid.error) {
      try {
        //check if the user exixt for id_user
        profileModel.find({ user: req._id }, async (err, data) => {
          if (data.length >= 1) { // 1 meens found a match 
            res.status(402).json({ message: "profile already created for the user", code: "duplicate" });
          }
          else {
            //add profile
            console.log('adding');
            req.body.user = req._id;
            console.log(req.body);
            let data = await profileModel.insertMany([req.body]);
            res.json(data);
          }
        });
      }
      catch (err) {
        res.status(400).json({ message: "Erorr" });
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

const getProfile = (req, res) => {
  try {
    profileModel.findOne({ user: req._id }).populate('user', 'avatar user email role')
      .then(data => { res.json(data); })
      .catch(err => { res.status(400).json(err); })
  }
  catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
}

//by id of profile 
const getPatient = (req, res) => {
  try {
    profileModel.findOne({ _id: req.params.id }).populate('patients', 'user email')
      .then(data => { res.json(data); })
      .catch(err => { res.status(400).json(err); })
  }
  catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
}

const editProfile = async (req, res) => {
  try {
    let valid = validEditProfile(req.body);
    if (!valid.error) {
      try {
        req.body.user = req._id;
        let data = await profileModel.updateOne({ user:  req._id }, req.body);
        res.json(data);
      }
      catch (err) {
        res.status(400).json({ message: "profile of user is not found"});
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

const deleteProfileItem = (req, res) => {
  try {
    profileModel.find({ user: req._id}, (err, data) => {
      if (err) { res.status(400).json(err) }
      profileModel.deleteMany( req.body)
      res.json(data);
    })
  }
  catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
}


module.exports = {
  createProfile,
  getProfile,
  getPatient,
  editProfile,
  deleteProfileItem
};