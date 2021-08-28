const Server = require('./server');
const config = require('./config/env.json');

const server = new Server(config.PORT);
server.run(config.PORT);
