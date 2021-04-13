const express = require('express');
const { authToken } = require('../middleware/auth');
const router = express.Router();
const control = require('../controllers/alerms');


router.get('/',authToken, (req, res) => {
    control.getAlerms(req, res); 
});

router.get('/:id',authToken, (req, res) => {
    control.getAlermsById(req, res); 
});

router.get('/today',authToken, (req, res) => {
    control.getAlermsForDay(req, res); 
});

router.get('/latast',authToken, (req, res) => {
    control.getLatastAlerm(req, res); 
});

router.get('/on',authToken, (req, res) => {
    control.getOnAlerms(req, res); 
});

router.post('/',authToken, (req, res) => {
    control.craeteAlerm(req, res); 
});

router.put('/:id',authToken, (req, res) => {
    control.editAlerm(req, res); 
});

module.exports = router;