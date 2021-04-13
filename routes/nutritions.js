const express = require('express');
const { authToken } = require('../middleware/auth');
const router = express.Router();
const control = require('../controllers/nutritions')


router.get('/',authToken, (req, res) => {
    control.getNutritions(req, res); 
});

router.get('/:id',authToken, (req, res) => {
    control.getNutritionsById(req, res); 
});

router.get('/:increaseFrom/:increaseTo',authToken, (req, res) => {
    control.getNutritionsIncrease(req, res); 
});

router.post('/',authToken, (req, res) => {
    control.nutrition(req, res); 
});

router.put('/:id',authToken, (req, res) => {
    control.editNutritions(req, res); 
});

module.exports = router;