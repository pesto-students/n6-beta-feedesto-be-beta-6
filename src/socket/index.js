const io = require('socket.io');

const frontEndWebsocket = io();
frontEndWebsocket.listen(6000);

module.exports = frontEndWebsocket;
