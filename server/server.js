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

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected')
    
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name are required!')
        }

        socket.join(params.room);

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
        console.log('User disconnected')
    });
});

server.listen(port, ()=> {
    console.log(`Server started on port ${port}.`)
});