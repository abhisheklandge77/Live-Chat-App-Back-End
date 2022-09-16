const http = require('http');
const express = require('express');
// const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const port = 4500;

// app.use(cors());

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});
const users = [];

io.on('connection', (socket) => {   
    console.log("New Connection");

    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined`);
        console.log("users: ", users);
        console.log("new user: ", users[socket.id]);
        socket.emit('welcome', { user: 'Admin', message: `Welcome to the chat ${users[socket.id]}` });
        socket.broadcast.emit('newUserJoined', { user: 'Admin', message: `${users[socket.id]} has joined the chat` });
    });
 

    socket.on('sendMessage', ({message, id, time}) => {
        io.emit('recieveMessage', {user: users[id], message, id, time});
    });

    socket.on('userDisconnect', () => {
        socket.broadcast.emit('userLeft', { user: 'Admin', message: `${users[socket.id]} has left` });
        console.log(`${users[socket.id]} has left`);
        delete users[socket.id];
        console.log("users: ", users);
    })


})
httpServer.listen(port, () => {
    console.log(`Server is working on : http://localhost:${port}`);
})