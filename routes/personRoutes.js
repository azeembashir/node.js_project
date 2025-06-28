const express = require('express');
const router = express.Router();

// import jwt functions
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

//import Person schema model
const Person = require('./../models/Person');

router.get('/', (req, res) =>{
  res.send('welcome to our hotel');
});

//POST route to add a Person
router.post('/signup', async(req, res) => {
  try {
    const data = req.body;
    //create a new Person document using mongoose model
    const newPerson = new Person(data);

    //save the new person to the database
    const response = await newPerson.save();
    console.log('data saved');

    const payload = {
      id: response.id,
      username: response.username
    }
    console.log(JSON.stringify(payload));
    

    // token functionality
    const token = generateToken(payload);
    console.log("Token is : ", token);
    
    res.status(200).json({response: response, token: token});
    
  } catch (err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
    
  }
});

// login route
router.post('/login', async (req, res) =>{
  try {
    // extract username and password from request body
    const {username, password} = req.body;

    // find the user by username
    const user = await Person.findOne({username: username});
    // if user does not exist or password does not match, return error
    if( !user || !(await user.comparePassword(password))){
      res.status(401).json({error: 'invalid username or password'})
    }
    // generate token
    const payload = {
      id: user.id,
      username: user.username
    }
    const token = generateToken(payload);
    // return token as response
    res.json({token});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'internal server error'});
  }
});

// profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) =>{
  try {
    const userData = req.user;
    console.log("user data: ", userData);

    const userId = userData.id;
    const user = await Person.findById(userId);

    res.status(200).json({user});

    
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'internal server error'});
  }
});

//Get method to get the person
router.get('/', jwtAuthMiddleware, async (req, res) =>{
  try {
    const data = await Person.find();
    console.log('data fetched');
    res.status(200).json(data);
    
  } catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
    
  }
});


// now learning about parameterized url
router.get('/:worktype', async (req, res) =>{
  
  try {
    const worktype = req.params.worktype; //extract the worktype from the url parameter
    if(worktype == 'chef' || worktype == 'waiter' || worktype == 'manager'){

      const response = await Person.find({work: worktype});
      console.log('response fetched');
      res.status(200).json(response);
      
    }else{
      res.status(404).json({error: 'invalid worktype'})
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
});

// update method
router.put('/:id', async (req, res) =>{
    try {

        const personId = req.params.id; //extract the id from url parameter
        const personUpdatedData = req.body;  //updated data for the person
        const response = await Person.findByIdAndUpdate(personId, personUpdatedData, {
            new: true,  //return the updated document
            runValidators: true     //run mongoose validation
        });

        if(!response){
            res.status(404).json({error: 'Person not found'});
        }

        console.log('data updated');
        res.status(200).json(response)
        
      
        

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }
    



});

// delete method
router.delete('/:id', async (req, res) =>{
  try {
    const personId = req.params.id; //extract the id from url parameter
    // assuming you have a person model
    const response = await Person.findByIdAndDelete(personId);

    if(!response){
        res.status(404).json({error: 'Person not found'});
    }

    console.log('data deleted');
    res.status(200).json({message: 'person deleted successfully'});
    




  } catch (err) {
      console.log(err);
      res.status(500).json({error: 'internal server error'});
  }
});

module.exports = router;