const express = require('express');

const discussion = require('./discussion');

const discussionRoutes = express.Router();

discussionRoutes.get('/', discussion.fetchAll);
discussionRoutes.post('/', discussion.create);
discussionRoutes.put('/:id', discussion.update);
discussionRoutes.get('/:id', discussion.fetchOne);
discussionRoutes.delete('/:id', discussion.deleteOne);

module.exports = discussionRoutes;
