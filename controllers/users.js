const express = require('express');
const { userModel } = require("../models/users");
const { validUser, validLogin, createToken, validEditUser } = require("../validations/users");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const gravatar = require('gravatar');

const getUsers = (req, res) => {
  try {
    userModel.find({}, { email: 1, user: 1 })
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

const getUser = (req, res) => {
  try {
    let userId = req._id;
    userModel.findOne({ _id: userId }, { email: 1, user: 1 })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(400).json(err);
      })
  }
  catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
}

const userLogin = async (req, res) => {
  try {
    let valid = validLogin(req.body);
    if (!valid.error) {
      try {
        let user = await userModel.findOne({ email: req.body.email })
        if (user) {
          // Checks if the password matches the user
          let validPass = await bcrypt.compare(req.body.pass, user.pass);
          if (!validPass) { res.status(401).json({ message: "Password does not match" }) }
          else {
            //console.log(user)
            let token = createToken(user.id, user.email);
            console.log(token);
            res.json({ token })
          }
        }
        else {
          res.status(404).json({ message: "user not found" })
        }
      }
      catch (err) {
        res.status(401).json(err);
      }
    }
    else {
      res.status(401).json(valid.error.details);
    }
  }
  catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
}

const userRegister = async (req, res) => {
  try {
    let valid = validUser(req.body);
    if (!valid.error) {
      //Defines the level of encryption
      let salt = await bcrypt.genSalt(10);
      req.body.pass = await bcrypt.hash(req.body.pass, salt);
      //Create avater for poto:
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      req.body.avatar = avatar;

      try {
        let data = await userModel.insertMany([req.body]);
        console.log(data);
        // Hides properties and displays only properties that are listed in a function
        let dataHidden = _.pick(data[0], ["user", "email", "_id", "date_time"])
        res.json(dataHidden)
      }
      catch (err) {
        res.status(400).json({ message: "user already in system ", code: "duplicate" });
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

const editUser = async (req, res) => {
  try {
    let userId = req._id;

    let valid = validEditUser(req.body);
    if (!valid.error) {

      try {
        let data = await userModel.updateOne({ _id: userId }, req.body);
        res.json(data);
      }
      catch (err) {
        res.status(400).json({ message: "user already in system ", code: "duplicate" });
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

const deleteUser = (req, res) => {
  try {
    let userId = req._id;
    userModel.deleteOne({ _id: userId }, (err, data) => {
      if (err) { res.status(400).json(err) }
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

//need fix doplicat id in list array 
const addPatient = async (req, res) => {
  try {
    //check if doctor :
    let user = await userModel.findOne({ _id: req._id })
    console.log('user', user.rule);
    if (user.rule == 'doctor') {
      //find the pationt
      try {
        let pationt = await userModel.findOne({ _id: req.body.id })
        //console.log('pationt',pationt._id);
        if (pationt) {
          //chack thet the id is not allrady in the array
          const found = user.patients.find(element => element == pationt._id);
          console.log(found);
          if (found) {
            res.status(400).json({ message: "user already in list" });
          }
          //else then push to array
          user.patients.push(req.body.id);
          user.save();
          res.status(200).json(user);

        }
        else {
          res.status(400).json(user);
        }
      }
      catch (err) {
        res.status(401).json(err.message);
      }
    }
    else {
      res.status(400).json({ message: "Authorization for physicians only", code: "no permission" });
    }
  }
  catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
}

const deletePatient = async (req, res) => {
  try {
    //check if doctor :
    let user = await userModel.findOne({ _id: req._id })
    if (user.rule == 'doctor') {
      //find the pationt
      try {
        let pationt = await userModel.findOne({ _id: req.body.id })
        if (pationt) {
          //chack thet the id is in the array
          try {
            let userValid = await userModel.find({ _id: req._id, patients: req.body.id })
            if (!userValid) {
              res.status(400).json({ message: "pationt is not in list" });
            }
          }
          catch (err) {
            res.status(401).json(err.message);
          }
          user.patients.pull(req.body.id);
          user.save();
          res.status(200).json(user);
        }
        else {
          res.status(400).json("Pationt not found");
        }
      }
      catch (err) {
        res.status(401).json(err.message);
      }
    }
    else {
      res.status(400).json({ message: "Authorization for physicians only", code: "no permission" });
    }
  }
  catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
}

const getPatients = (req, res) => {
  try {
    userModel.findOne({ _id: req._id }).populate('patients', 'user email')
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

const getPatient = async (req, res) => {
  try {
    let user = await userModel.find({ _id: req._id, patients: req.params.id }).populate('patients', 'user email')
    if (user.populate) {
      res.status(200).json(user);
    }
    else {
      res.status(400).json({ message: "pationt is not in list" });
    }
  }
  catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
}

//when adding friend its added only to the list of the curr user
// needed 2 calls one for mainUser and one for hisFriend
const addFriend = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req._id })
    console.log('user', user.rule);
    if (user.rule == 'regular') {
      //find the friend
      try {
        let friend = await userModel.findOne({ _id: req.body.id })
        //console.log('pationt',pationt._id);
        if (friend) {
          //chack thet the id is not allrady in the array
          const found = user.patients.find(element => element == friend._id);
          console.log(found);
          if (found) {
            res.status(400).json({ message: "user already in list" });
          }
          //else then push to array
          user.friends.push(req.body.id);
          user.save();
          res.status(200).json(user);

        }
        else {
          res.status(400).json(user);
        }
      }
      catch (err) {
        res.status(401).json(err.message);
      }
    }
    else {
      res.status(400).json({ message: "Authorization for physicians only", code: "no permission" });
    }
  }
  catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
}





module.exports = {
  getUsers,
  getUser,
  userLogin,
  userRegister,
  editUser,
  deleteUser,

  addPatient,
  deletePatient,
  getPatients,
  getPatient,

  addFriend

};