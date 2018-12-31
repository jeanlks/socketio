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

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected')

    socket.on('createMessage', function(message) {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createAt: new Date().getTime()
        });
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