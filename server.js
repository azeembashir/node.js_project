
// making server
const express = require('express')

// import database connection
const db = require('./db');

const app = express()

// importing .env file
require('dotenv').config();





//import body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());                 //then it store data in req body

//process .env file or port
const PORT = process.env.PORT || 3000;




// about lodash => its a inbuilt function to deal data easily first install it 'npm i lodash'
// var _ = require('lodash');

// var data = ['azeem', '1', '1', 'azeem'];
// var filter = _.uniq(data);
// console.log(filter);

app.get('/', (res, req) =>{
  res.send('welcome to our hotel');
});




// importing router from PersonRoutes.js
const personRoutes = require('./routes/personRoutes');

const menuItemsRoutes = require('./routes/menuItemsRoutes');

// use the router
app.use('/person', personRoutes);

app.use('/menuitem', menuItemsRoutes);



app.listen(PORT, ()=> console.log('listening on port 3000'));



