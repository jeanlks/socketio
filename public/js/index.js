var socket = io();

socket.on('connect', function() {
    console.log('Server connected');
});

socket.on('disconnect', function() {
   console.log('Server disconnected');
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
});

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();

    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
});


jQuery('#message-form').on('submit', function(e) {

    var messageTextBox = jQuery('[name=message]')
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(){
        messageTextBox.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function(){
    if(!navigator.geolocation) {
        return alert('Geolocation not suppported by your browser');
    }

    locationButton.attr('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition(function(position) {
      locationButton.removeAttr('disabled');
      socket.emit('createLocationMessage', {
         latitude: position.coords.latitude,
         longitude: position.coords.longitude
      });
    }, function(){
        locationButton.attr('disabled', 'disabled');
        alert('Unable to fetch location');
    });
});