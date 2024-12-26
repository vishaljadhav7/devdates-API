const socketIo = require('socket.io');

let io;

let connectedUsers = {};

function createSocketConnection(server) {
      io = socketIo(server, {
        cors : {
            origin : "*",
            methods : ['GET', 'POST']
        }
      });
  

    io.on('connection', (socket) => {

        console.log(`Client connected: ${socket.id}`);

        socket.on('join' , (data) => {
            connectedUsers[data.userId] = socket.id
        })

  

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const getReceiverSocketId = (receiverId) => {
 const receiverSocketId = connectedUsers[receiverId];
  return  receiverSocketId;
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (io) {
        io.to(socketId).emit(messageObject.eventName, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
} // send-message

module.exports = { createSocketConnection, sendMessageToSocketId, getReceiverSocketId};