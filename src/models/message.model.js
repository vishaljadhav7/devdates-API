const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message : {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

MessageSchema.pre("save", async function(next){
  const newMessage = this
  if(newMessage.senderId.equals(newMessage.receiverId)){
    throw new Error("can't send message to yourself")
  }
  next();
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;