const CommentModel = require('./schema');

module.exports = class CommentDbModel {
  constructor({ db }) {
    this.mongooseModel = CommentModel(db);
  }

  /**
   * create comment
   * @param {Object} commentObject
   * @return {Object}
   */
  create(commentObject) {
    try {
      return this.mongooseModel.create(commentObject);
    } catch (error) {
      error.meta = { ...error.meta, 'commentDbModel.create': { commentObject } };
      throw error;
    }
  }
};
