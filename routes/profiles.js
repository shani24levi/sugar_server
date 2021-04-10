const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/auth');
const control = require('../controllers/profiles')


/* GET user profile after login*/
router.get('/user',authToken, (req, res) => {
  control.getProfile(req, res);
})

/* GET user profile by name - for use of the doctors*/
router.get('/patient/:id', (req, res) => {
    control.getPatient(req, res);
  })

//create
router.post("/",authToken, async (req, res) => {
  control.createProfile(req, res);
})

router.put("/",authToken, async (req, res) => {
  control.editProfile(req, res);
})

router.delete("/item",authToken, (req,res) => {
  control.deleteProfileItem(req, res);
})


module.exports = router;
