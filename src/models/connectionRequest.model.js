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


connectionRequestSchema.pre("save", async function(next){
  const connectionRequest = this
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("can't send connection request to yourself")
  }
  next();
})

connectionRequestSchema.index({
    fromUserId : 1,
    toUserId : 1
})

const connectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel;

