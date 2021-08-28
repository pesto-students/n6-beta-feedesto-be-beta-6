const express = require('express');
const cors = require('cors');

const bugsnagClient = require('./config/bugsnag');
const { requestHandler, errorHandler } = bugsnagClient.getPlugin('express');

const { setup } = require('./awilix.js');
const apiErrorHandler = require('./error/api-error-handler.js');

const eventEmitter = require('./helpers/emitEvent');

const frontEndWebsocket = require('./socket');

setup();
const router = require('./api');

class Server {
  constructor() {
    this.app = express();
    this.setup();
  }

  setup() {
    this.app.use(cors());
    this.app.use(requestHandler);
    this.app.use(express.json());
    this.app.use('/', router);
    this.app.use(apiErrorHandler);
    this.app.use(errorHandler);
  }

  run(port) {
    this.server = this.app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
    eventEmitter.on('emitToFrontEnd', ({ topic, model, object, action }) => {
      frontEndWebsocket.emit(topic, { model, object, action });
    });
  }

  stop(done) {
    this.server.close(done);
  }
}

module.exports = Server;
