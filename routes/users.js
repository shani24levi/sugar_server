const express = require('express');
const { authToken } = require('../middleware/auth');
const router = express.Router();
const control = require('../controllers/users')

/* ************************************ */
//        routs for user :
/* ************************************ */

/* GET all users */
router.get('/', (req, res) => {
  control.getUsers(req,res);
});

/* GET user by id after login*/
router.get('/user',authToken, (req, res) => {
  control.getUser(req, res);
})

// authToken- find login user
router.get('/admin',authToken, (req, res) => {
  userModel.find({})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

router.post("/login", async (req, res) => {
  control.userLogin(req, res);
})

router.post("/", async (req, res) => {
  control.userRegister(req, res);
})

router.put("/",authToken, async (req, res) => {
  control.editUser(req, res);
})

router.delete("/",authToken, (req,res) => {
  control.deleteUser(req, res);
})

/* ************************************ */
//        routs for doctor :
/* ************************************ */
router.post("/patient",authToken, async (req, res) => {
  control.addPatient(req, res);
})

router.delete("/patient",authToken, async (req, res) => {
  control.deletePatient(req, res);
})
//get all patients
router.get("/patients",authToken, async (req, res) => {
  control.getPatients(req, res);
})

//get one patient
router.get("/patient/:id",authToken, async (req, res) => {
  control.getPatient(req, res);
})

router.post("/friend",authToken, async (req, res) => {
  control.addFriend(req, res);
})


module.exports = router;