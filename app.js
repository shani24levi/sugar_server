const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const colors = require('colors');

const dotenv = require('dotenv');
dotenv.config();
const app = express();

//Conect to DB
const mongoCon = require("./dbs_connected/mongo_connected");

//Middleware 
app.use(logger('dev'));
app.use(express.json());
//app.use(express.static('image'));
//app.use(express.static('up'));
app.use(express.urlencoded({ extended: false }));

// Server static assets 
app.all('*', function (req, res, next) {
  if (!req.get('Origin')) return next();
  res.set('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,x-auth-token,x-api-key');
  next();
});


//Routs Middlewares
const usersRouter = require('./routes/users');
const profilesRouter = require('./routes/profiles');
const alermsRouter = require('./routes/alerms');
const glucoseLevelsRouter = require('./routes/glucoselevels');
const nutritionsRouter = require('./routes/nutritions');
const massagesRouter = require('./routes/massages');

app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
//app.use('/alerms', alermsRouter);
//app.use('/glucoselevels', glucoseLevelsRouter);
//app.use('/nutritions', nutritionsRouter);
//app.use('/massages', massagesRouter);


//Listening on port 
const port = process.env.PORT || 5000 ;
app.listen(port, () => console.log(colors.red.underline.bgBrightWhite(`Server running on port ${port}`)));
