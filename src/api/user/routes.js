const express = require('express');

const user = require('./user');

const userRoutes = express.Router();

userRoutes.get('/', user.fetchAll);
userRoutes.put('/:id', user.update);
userRoutes.get('/:id', user.fetchOne);
// userRoutes.delete('/:id', user.deleteOne);

module.exports = userRoutes;
