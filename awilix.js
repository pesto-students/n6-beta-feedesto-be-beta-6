const awilix = require('awilix');

const { AuthenticationService } = require('./src/service');

const { UserDbModel, DiscussionDbModel, CommentDbModel, OrganizationDbModel } = require('./src/dbModel');

const db = require('./src/db');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

function setup() {
  container.register({
    db: awilix.asValue(db),

    // // inject database connection pooling
    authenticationService: awilix.asClass(AuthenticationService).scoped(),

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
