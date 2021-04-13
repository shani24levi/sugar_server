const express = require('express');
const { authToken } = require('../middleware/auth');
const router = express.Router();
const control = require('../controllers/glucoselevels')

/* ********************************************************* */
//               GET routs for user
/* ********************************************************* */

/* GET the latest glucose in time&date*/
router.get('/', authToken, (req, res) => {
    control.getCurrGlucose(req, res);
})

/*Dayly of current year (from 00:00 to now())*/
router.get('/dayly', authToken, (req, res) => {
    control.getDaylyGlucose(req, res);
})

// /*Weekly of current year*/
// router.get('/weekly', authToken, (req, res) => {
//     control.getWeeklyGlucose(req, res);
// })

// //Montly of current year
// router.get('/montly', authToken, (req, res) => {
//     control.getMontlyGlucose(req, res);
// })
// //annual of 12 months back 
// router.get('/annual', authToken, (req, res) => {
//     control.getAnnualGlucose(req, res);
// })

// //get last houres by params (betwin 1 to 12)
// router.get('/:time', authToken, (req, res) => {
//     control.getGlucoseByTime(req, res);
// })

//get high levels 
router.get('/high', authToken, (req, res) => {
    control.getHighGlucose(req, res);
})

//get low levels 
router.get('/low', authToken, (req, res) => {
    control.getLowGlucose(req, res);
})


/* ********************************************************* */
//             GET routs for: doctor or friend
/* ********************************************************* */

// /* GET the latest glucose in time&date*/
// router.get('/:id', authToken, (req, res) => {
//     control.getCurrGlucoseOfUser(req, res);
// })

// /*Dayly of current year (from 00:00 to now())*/
// router.get('/dayly/:id', authToken, (req, res) => {
//     control.getDaylyGlucoseOfUser(req, res);
// })

// /*Weekly of current year*/
// router.get('/weekly/:id', authToken, (req, res) => {
//     control.getWeeklyGlucoseOfUser(req, res);
// })

// //Montly of current year
// router.get('/montly/:id', authToken, (req, res) => {
//     control.getMontlyGlucoseOfUser(req, res);
// })
// //annual of 12 months back 
// router.get('/annual/:id', authToken, (req, res) => {
//     control.getAnnualGlucoseOfUser(req, res);
// })

// //get last houres by params (betwin 1 to 12)
// router.get('/:time/:id', authToken, (req, res) => {
//     control.getGlucoseByTimeOfUser(req, res);
// })

//get high levels 
router.get('/high/:id', authToken, async(req, res) => {
    control.getHighGlucoseOfUser(req, res);
})

//get low levels 
router.get('/low/:id', authToken, async(req, res) => {
    control.getLowGlucoseOfUser(req, res);
})

/* ********************************************************* */
//              POST rout for ONE user 
/* ********************************************************* */
//post new level from divice 
router.post('/', authToken, async(req, res) => {
    control.glucoseLevel(req, res);
})

module.exports = router;