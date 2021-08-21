const { ObjectId } = require('mongoose').Types;

const DiscussionModel = require('./schema');

module.exports = class DiscussionDbModel {
  constructor({ db }) {
    this.mongooseModel = DiscussionModel(db);
  }

  /**
   * find all discussions
   * @param {String} organizationId
   * @param {String} userId
   * @return {Array}
   */
  findAll(organizationId, userId) {
    try {
      if (userId) {
        return this.mongooseModel
          .find({
            organizationId,
            $or: [
              { participantIds: { $elemMatch: { participantIds: userId } } },
              { viewerIds: { $elemMatch: { viewerIds: userId } } }
            ]
          })
          .lean();
      }

      return this.mongooseModel.find({ organizationId }).lean();
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
   * find a specific discussion document by ID
   * @param {String} organizationId
   * @return {Object}
   */
  findByIdFormatted(id, organizationId, userId) {
    try {
      let query;

      if (userId) {
        query = [
          { $match: { _id: ObjectId(id), organizationId: ObjectId(organizationId) } },
          {
            $lookup: {
              from: 'users',
              localField: 'createdById',
              foreignField: '_id',
              as: 'createdById'
            }
          },
          { $unwind: '$createdById' },
          {
            $lookup: {
              from: 'comments',
              let: { discussionId: '$_id', commentableType: 'Discussion' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$discussionId', '$$discussionId'] },
                        { $eq: ['$commentableType', '$$commentableType'] }
                      ]
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'commentedByUserId',
                    foreignField: '_id',
                    as: 'commentedByUserId'
                  }
                },
                { $unwind: '$commentedByUserId' },
                { $addFields: { commentedByUserId: { uniqueId: '$commentedByUserId.uniqueId' } } }
              ],
              as: 'comments'
            }
          }
        ];
      } else {
        query = [
          { $match: { _id: ObjectId(id), organizationId: ObjectId(organizationId) } },
          {
            $lookup: {
              from: 'users',
              localField: 'createdById',
              foreignField: '_id',
              as: 'createdById'
            }
          },
          { $unwind: '$createdById' },
          {
            $lookup: {
              from: 'comments',
              let: { discussionId: '$_id', commentableType: 'Discussion' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$discussionId', '$$discussionId'] },
                        { $gte: ['$commentableType', '$$commentableType'] }
                      ]
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'commentedByUserId',
                    foreignField: '_id',
                    as: 'commentedByUserId'
                  }
                },
                { $unwind: '$commentedByUserId' }
              ],
              as: 'comments'
            }
          }
        ];
      }

      return this.mongooseModel.aggregate(query).allowDiskUse(true);
    } catch (error) {
      error.meta = { ...error.meta, 'discussionDbModel.findById': { id, organizationId, userId } };
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
