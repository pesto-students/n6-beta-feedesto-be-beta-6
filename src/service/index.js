const AuthenticationService = require('./authentication');
const UserService = require('./users');
const OrganizationService = require('./organizations');
const DiscussionService = require('./discussions');
const CommentService = require('./comments');

module.exports = {
  AuthenticationService,
  OrganizationService,
  DiscussionService,
  CommentService,
  UserService
};
