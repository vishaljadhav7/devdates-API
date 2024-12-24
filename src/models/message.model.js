const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Indexes for optimizing message queries
MessageSchema.index({ conversationId: 1 });
MessageSchema.index({ sender: 1, receiver: 1 });

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;