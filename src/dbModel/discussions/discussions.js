const DiscussionModel = require('./schema');

module.exports = class DiscussionDbModel {
  constructor({ db }) {
    this.mongooseModel = DiscussionModel(db);
  }

  /**
   * find all discussions
   * @return {Array}
   */
  findAll() {
    try {
      return this.mongooseModel.find({}).lean();
    } catch (error) {
      throw error;
    }
  }

  /**
   * create discussion
   * @param {Object} discussion object
   * @return {Object}
   */
  create(discussion) {
    try {
      return this.mongooseModel.create(discussion);
    } catch (error) {
      error.meta = { ...error.meta, 'discussionDbModel.create': { discussion } };
      throw error;
    }
  }

  /**
   * find a specific discussion document by ID
   * @param {String} discussionId
   * @return {Object}
   */
  findById(discussionId) {
    try {
      return this.mongooseModel.findById(discussionId).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'discussionDbModel.findById': { discussionId } };
      throw error;
    }
  }

  /**
   * find a specific discussion document and update it
   * @param {String} discussionId: discussionId used to find the document to update
   * @param {Object} updateData: update data that needs to be pushed to the db
   * @return {Object}
   */
  findByIdAndUpdate(discussionId, updateData) {
    try {
      return this.mongooseModel.findByIdAndUpdate(discussionId, updateData, { new: true }).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'discussionDbModel.findByIdAndUpdate': { discussionId, updateData } };
      throw error;
    }
  }
  /**
   *
   * @param {String} discussionId
   * @returns {string}
   */
  deleteById(discussionId) {
    try {
      return this.mongooseModel.deleteOne(discussionId).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'discussionDbModel.findByIdAndUpdate': { discussionId, updateData } };
      throw error;
    }
  }
};
