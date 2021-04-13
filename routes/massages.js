const express = require('express');
const { authToken } = require('../middleware/auth');
const router = express.Router();
const control = require('../controllers/massages');


router.get('/',authToken, (req, res) => {
    control.getMassages(req, res); 
});

router.get('/:id',authToken, (req, res) => {
    control.getMassagesById(req, res); 
});

router.get('/today',authToken, (req, res) => {
    control.getMassagesForDay(req, res); 
});

router.get('/latast',authToken, (req, res) => {
    control.getLatastMassage(req, res); 
});

router.get('/open',authToken, (req, res) => {
    control.getOpenMassages(req, res); 
});

router.get('/reply',authToken, (req, res) => {
    control.getReplyedMassages(req, res); 
});

router.post('/',authToken, (req, res) => {
    control.craeteMassage(req, res); 
});

router.delete('/',authToken, (req, res) => {
    control.deleteMassage(req, res); 
});

module.exports = router;