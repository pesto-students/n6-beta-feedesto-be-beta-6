const moment = require('moment');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../config/env.json');

const signToken = (data, expiry) => {
  return new Promise((resolve, reject) => {
    jwt.sign(data, JWT_SECRET, { expiresIn: expiry }, (error, token) => {
      if (error) {
        return reject(error);
      }
      resolve(token);
    });
  });
};

const isKeyExpired = keyExpiry => {
  return keyExpiry ? moment().diff(moment(keyExpiry)) > 0 : true;
};

module.exports = {
  signToken,
  isKeyExpired
};
