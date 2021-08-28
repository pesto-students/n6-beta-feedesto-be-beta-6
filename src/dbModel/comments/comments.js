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

  /**
   * find comment by discussion id
   * @param {String} id
   * @return {[Object]}
   */
  findAllByDisscussionId(id, userId) {
    try {
      if (userId)
        return this.mongooseModel
          .find({ commentableId: id, commentableType: 'Discussion' })
          .populate('commentedById', '_id');
      return this.mongooseModel.find({ commentableId: id, commentableType: 'Discussion' }).populate('commentedById');
    } catch (error) {
      error.meta = { ...error.meta, 'commentDbModel.create': { commentObject } };
      throw error;
    }
  }

  /**
   *
   * @param {String} discussionId
   * @returns {string}
   */
  deleteByDiscussionId(discussionId) {
    try {
      return this.mongooseModel.deleteMany({ commentableId: discussionId }).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'commentDbModel.deleteByDiscussionId': { discussionId } };
      throw error;
    }
  }

  /**
   *
   * @param {String} id
   * @returns {string}
   */
  deleteById(id) {
    try {
      return this.mongooseModel.deleteOne({ _id: id }).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'commentDbModel.deleteById': { id } };
      throw error;
    }
  }

  /**
   *
   * @param {String} id
   * @returns {Object}
   */
  findById(id) {
    try {
      return this.mongooseModel.findOne({ _id: id }).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'commentDbModel.findById': { id } };
      throw error;
    }
  }
};
