// importing passport and passport-local strategy
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// importing Person model
const Person = require('./models/Person');

// authentication and authorization
// configuring local strategy 
passport.use(new localStrategy(async (USERNAME, PASSWORD, done) =>{  //done is providing passport functionality
  //authentication logic
  try {
    // console.log('Received Credentials', USERNAME, PASSWORD);
    const user = await Person.findOne({username: USERNAME});
    if(!user)
      return done(null, false, {message: 'Incorrect username'});

    const isPasswordMatch = await user.comparePassword(PASSWORD);
    if(isPasswordMatch){
      return done(null, user)
    }else{
      return done(null, false, {message : 'incorrect password'})
    }
    
  } catch (error) {
    return done(error);
  }
}));

module.exports = passport;