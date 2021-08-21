const Bugsnag = require('@bugsnag/js');
const bugsnagExpress = require('@bugsnag/plugin-express');
const unhandledRejection = require('unhandled-rejection');

const { BUGSNAG_KEY_SERVER, NODE_ENV } = require('../env.json');

const appVersion = require('../../package.json').version;

Bugsnag.start({
  plugins: [bugsnagExpress],
  apiKey: BUGSNAG_KEY_SERVER,
  appVersion,
  releaseStage: NODE_ENV,
  notifyReleaseStages: ['production', 'staging']
});

let rejectionEmitter = unhandledRejection({ timeout: 20 });

rejectionEmitter.on('unhandledRejection', (error, promise) => {
  console.error('bugsnag/unhandledRejection', error);
  Bugsnag.notify(error);
});

module.exports = Bugsnag;
