const express = require('express');
const cors = require('cors');

const bugsnagClient = require('./config/bugsnag');
const { requestHandler, errorHandler } = bugsnagClient.getPlugin('express');

const { setup } = require('./awilix.js');
const apiErrorHandler = require('./error/api-error-handler.js');

setup();
const router = require('./src/api');

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
  }

  stop(done) {
    this.server.close(done);
  }
}

module.exports = Server;
