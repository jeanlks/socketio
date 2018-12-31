const path = require('path');
const express = require('express')
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io')
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var {generateMessage, generateLocationMessage} = require('./utils/message');
var {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected')
    
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required!')
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    });

    socket.on('createMessage', function(message, callback) {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createAt: new Date().getTime()
        });
        callback();
    });

    socket.on('createLocationMessage', function(coords) {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', ()=> {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
        }
    });
});

server.listen(port, ()=> {
    console.log(`Server started on port ${port}.`)
});