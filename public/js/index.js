var socket = io();

socket.on('connect', function() {
    console.log('Server connected');
});

socket.on('disconnect', function() {
   console.log('Server disconnected');
});

socket.on('newMessage', function(message) {
    console.log('message received', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    });
});

