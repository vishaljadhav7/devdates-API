const mongoose = require('mongoose')
const User = require('../models/user.model')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.ObjectId,
        ref : User,
        required : true
    },
    toUserId : {
        type : mongoose.Schema.ObjectId,
        ref : User,
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["ignored", "interested", "accepted", "rejected"],
            message : "{VALUE} is incorrect status type"
        }
    }
}, {timestamps : true});

const connectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel;

