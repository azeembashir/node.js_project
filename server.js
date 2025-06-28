// making server
const express = require('express');
const app = express();

// import database connection
const db = require('./db');


// importing .env file
require('dotenv').config();

// import passport from auth.js
const passport = require('./auth');

//import body parser. install it first
const bodyParser = require('body-parser');
app.use(bodyParser.json());                 //then it store data in req body

//process .env file or port
const PORT = process.env.PORT || 3000;

// middleware function for date and time
const logRequest = (req, res, next) =>{
  console.log(`[${new Date().toLocaleString()}] Request made to : ${req.originalUrl}`);
  next();           //move to the next phase
  
};

// now using this middleware function in all routes
app.use(logRequest);


// initializing passport   (authentication work)
app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', {session: false});

// about lodash => its a inbuilt function to deal data easily first install it 'npm i lodash'
// var _ = require('lodash');

// var data = ['azeem', '1', '1', 'azeem'];
// var filter = _.uniq(data);
// console.log(filter);


// importing router from PersonRoutes.js
const personRoutes = require('./routes/personRoutes');

// importing router from menuItemsRoutes.js
const menuItemsRoutes = require('./routes/menuItemsRoutes');

// use the router
app.use('/person', personRoutes);

app.use('/menuitem', menuItemsRoutes);



app.listen(PORT, ()=> console.log('listening on port 3000'));