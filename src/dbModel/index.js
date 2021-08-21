const UserModel = require('./users/schema');
const UserDbModel = require('./users/users');
const CommentModel = require('./comments/schema');
const DiscussionModel = require('./discussions/schema');
const CommentDbModel = require('./comments/comments');
const DiscussionDbModel = require('./discussions/discussions');
const OrganizationDbModel = require('./organizations/organizations');
const OrganizationModel = require('./organizations/schema');

module.exports = {
  UserModel,
  UserDbModel,
  CommentModel,
  DiscussionModel,
  CommentDbModel,
  DiscussionDbModel,
  OrganizationDbModel,
  OrganizationModel
};
