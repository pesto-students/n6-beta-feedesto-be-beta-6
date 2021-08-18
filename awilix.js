const awilix = require('awilix');

const db = require('./src/db');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

function setup() {
  container.register({


    // // inject database connection pooling
    db: awilix.asValue(db),
  });
}

module.exports = {
  container,
  setup,
};
