const mongoose = require('mongoose')
const User = require('./user.model')

const connectionInviteSchema = new mongoose.Schema({
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


connectionInviteSchema.pre("save", async function(next){
  const connectionInvite = this
  if(connectionInvite.fromUserId.equals(connectionInvite.toUserId)){
    throw new Error("can't send connection request to yourself")
  }
  next();
})

connectionInvite.index({
    fromUserId : 1,
    toUserId : 1
})

const ConnectionInviteModel = new mongoose.model("connectionInvite", connectionInviteSchema);

module.exports = ConnectionInviteModel;

