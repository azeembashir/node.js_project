const mongoose = require('mongoose');
// import bcrypt
const bcrypt = require('bcrypt');

// define the Person schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    work: {
        type: String,
        enum: ['chef', 'waiter', 'manager'],
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String
    },
    salary: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// hash password generator
personSchema.pre('save', async function(next){
    const person = this;
    // hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();
    try {
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashPassword = await bcrypt.hash(person.password, salt);
        // overide the person password into hash password
        person.password = hashPassword;
        next();
        
    } catch (error) {
        return next(error);
    }
});


// compare function declare in auth.js
personSchema.methods.comparePassword = async function(candidatePassword){   //.methods custom method bnane ka tareeka
    try {                                               //candidatePassword=> wo password jab user login k wqt deta he
        // use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }

};
// concept of comparaing passwor:
// ham jo password dalengy uske db apna hash password generate krega ab jab ham login k tym pr dubara
//  hamne password dala to ye function compare krne k lye pehle hash password ko hamare wale password
//  mn change nah krega blky apne hash password mn salt extract krega phr ye salt+hamne jo bad mn login
// k wqt password dala usko usko add krega phr iska hash bnayga. ab wo purana hash or ye new hash dono ko compare krega or difficulty dhoondega.

// create Person model
const Person = mongoose.model('Person', personSchema);
module.exports = Person;