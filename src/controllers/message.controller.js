const Conservation = require('../models/conversation.model');
const Message = require('../models/message.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const {getReceiverSocketId, sendMessageToSocketId} = require('../socket');
const User = require('../models/user.model');

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const {receiverId} = req.params;
    const senderId = req.userInfo._id;

    const doesReceiverIdExist = await User.findById({_id : receiverId})

    
    if(!doesReceiverIdExist){
        throw new Error("user does not exist")
    }

    let conversation = await Conservation.findOne({
        participants : {$all : [senderId, receiverId]},
    });
    
    if(!conversation){
        conversation = new Conservation({
            participants : [senderId , receiverId]
        })
    };
    
    const newMessage = new Message({
        senderId,
        receiverId,
        message,
    });
    

    if(newMessage){
        conversation.messages.push(newMessage._id);
    };
    
   await Promise.all([conversation.save(), newMessage.save()]);

   const receiverSocketId = getReceiverSocketId(receiverId);

   const generatedMessage = await Message.findById(newMessage._id).populate("senderId", "firstName lastName photoURL").populate("receiverId", "firstName lastName photoURL")
   
   if(receiverSocketId){
       sendMessageToSocketId(receiverSocketId, {
           eventName : "new-message",
           data : generatedMessage
        })
   }


   const serverResponse = new ApiResponse(200, generatedMessage, 'message sent succesfully');

   res.status(200).json(serverResponse);
  } catch (error) {
    res.status(400).json(new ApiError(400, error.message || 'message could not be sent'));
  }
};


const getMessages = async (req, res) => {
    try {
      const {receiverId} = req.params;
      const senderId = req.userInfo._id;  

      const doesReceiverIdExist = await User.findById({_id : receiverId})

      if(!doesReceiverIdExist){
          throw new Error("user does not exist")
      };

      const conversation = await Conservation.findOne({
        participants : {$all : [senderId, receiverId]},
      }).populate("participants", "firstName lastName photoURL").populate("messages")
      ;

    if (!conversation) {
        return res.status(200).json(
            new ApiResponse(200, [], 'conversation not found')
        )
    };
  

    const messages = conversation.messages; 

    return res.status(200).json(
        new ApiResponse(200, conversation, 'conversation found')
    ); 

    } catch (error) {
        res.status(400).json(new ApiError(400, error.message || 'messages not found'));
    }
}

module.exports = {sendMessage, getMessages};