var express = require('express');
var app = express();

const io = require('socket.io')(); 
// instantiate the socket right away with ()

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// socket.io stuff goes here messaging functionality

// attach socket.io
io.attach(server);

io.on('connection', function(socket) {
    console.log('user connected');
    message = `${socket.id} has joined the chat!`;
    io.emit('new_connect', message);
    socket.emit('connected', {sID: `${socket.id}`})

    socket.on("chat_message", function(msg) {
        console.log(msg);
        io.emit("new_message", { id: socket.id, message: msg})
    })

    // listen for a disconnect
    socket.on('disconnect', function() {
        console.log('a user disconnected');
        message = `${socket.id} has left the chat!`;
        io.emit('user_disconnect', message);
    })
})