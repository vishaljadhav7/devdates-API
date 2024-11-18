const mongoose = require('mongoose')

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
        lowercase: true
    },
    password : {
        type : String,
        required : true,
        minLength : 7,
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
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }
}, {timestamps : true});



module.exports = mongoose.model("user", userSchema)