// src/db/connect.ts

const mongoose = require('mongoose');

const { DB_URL } = require('../../config/env.json');

mongoose
  .connect(process.env.DB_URL || DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Database connected');
  })
  .catch(error => {
    console.error('db error', error);
    process.exit(1);
  });

module.exports = mongoose;
