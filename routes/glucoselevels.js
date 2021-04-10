const express = require('express');
const { authToken } = require('../middleware/auth');
const router = express.Router();
const control = require('../controllers/glucoselevels')