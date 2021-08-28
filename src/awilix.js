const awilix = require('awilix');

const {
  AuthenticationService,
  OrganizationService,
  DiscussionService,
  CommentService,
  UserService
} = require('./service');

const { UserDbModel, DiscussionDbModel, CommentDbModel, OrganizationDbModel } = require('./dbModel');

const db = require('./db');

const eventEmitter = require('./helpers/emitEvent');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

function setup() {
  container.register({
    // inject database
    db: awilix.asValue(db),

    eventEmitter: awilix.asValue(eventEmitter),

    authenticationService: awilix.asClass(AuthenticationService).scoped(),
    organizationService: awilix.asClass(OrganizationService).scoped(),
    discussionService: awilix.asClass(DiscussionService).scoped(),
    userService: awilix.asClass(UserService).scoped(),
    commentService: awilix.asClass(CommentService).scoped(),

    userDbModel: awilix.asClass(UserDbModel).scoped(),
    discussionDbModel: awilix.asClass(DiscussionDbModel).scoped(),
    commentDbModel: awilix.asClass(CommentDbModel).scoped(),
    organizationDbModel: awilix.asClass(OrganizationDbModel).scoped()
  });
}

module.exports = {
  container,
  setup
};
