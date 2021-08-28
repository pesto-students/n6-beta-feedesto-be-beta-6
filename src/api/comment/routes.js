const express = require('express');

const comment = require('./comment');

const commentRoutes = express.Router();

// discommenttes.post('/', comment.create);
commentRoutes.put('/:id', comment.update);
commentRoutes.delete('/:id', comment.deleteOne);

module.exports = commentRoutes;
