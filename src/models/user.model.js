const mongoose = require('mongoose')
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName : {
      type : String,
      required : true,
      minLength : 4,
      maxLength : 10, 
    },
    lastName : {
        type : String,
        minLength : 4,
        maxLength : 10, 
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase: true,
        validate : (val) => {
          if(!validator.isEmail(val)){
            throw new Error('not valid email')
          }
        }
    },
    password : {
        type : String,
        required : true,
        minLength : 7,
        validate : (val) => {
            if(!validator.isStrongPassword(val)){
              throw new Error('not a strong password')
            }
          }
    },
    age : {
        type : String,
        min : 18,
    },
    gender : {
        type : String,
        required : true,
        validate : (val) => {
            if(!['male', 'female', 'others'].includes(val)){
                throw new Error('gender data not valid')
            }
        }
    },
    skills : {
        type : [String]
    },
    about : {
        type : String,
        default : "I am a developer"
    },
    photoURL : {
        type : String,
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate : (val) => {
            if(!validator.isURL(val)){
              throw new Error('not a valid URL')
            }
          }
    }
}, {timestamps : true});



module.exports = mongoose.model("user", userSchema)