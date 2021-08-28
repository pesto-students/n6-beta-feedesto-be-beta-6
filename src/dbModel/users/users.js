const UserModel = require('./schema');

module.exports = class UserDbModel {
  constructor({ db }) {
    this.mongooseModel = UserModel(db);
  }

  /**
   * find all users
   * @return {Array}
   */
  findAll() {
    try {
      return this.mongooseModel.find({}).lean();
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  /**
   * fetch active userIds
   * @param {String} organizationId
   * @return {[Object]}
   */
  findAllActiveIdsByOrganizationId(organizationId) {
    try {
      return this.mongooseModel
        .find({ organizationId, isApproved: true })
        .select('_id')
        .lean();
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  /**
   * create user
   * @param {Object} user object
   * @return {Object}
   */
  create(user) {
    try {
      return this.mongooseModel.create(user);
    } catch (error) {
      error.meta = { ...error.meta, 'userDbModel.create': { user } };
      console.log(error);

      throw error;
    }
  }

  /**
   * find a specific user document by ID
   * @param {String} userId
   * @return {Object}
   */
  findById(userId) {
    try {
      return this.mongooseModel.findById(userId).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'userDbModel.findById': { userId } };
      console.log(error);

      throw error;
    }
  }

  /**
   * find a specific user document by email
   * @param {String} email
   * @return {Object}
   */
  findByEmail(email) {
    try {
      return this.mongooseModel.findOne({ email }).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'userDbModel.findByEmail': { email } };
      console.log(error);

      throw error;
    }
  }

  /**
   * find a specific user document and update it
   * @param {String} userId: userId used to find the document to update
   * @param {Object} updateData: update data that needs to be pushed to the db
   * @return {Object}
   */
  findByIdAndUpdate(userId, updateData) {
    try {
      return this.mongooseModel.findByIdAndUpdate(userId, updateData, { new: true }).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'userDbModel.findByIdAndUpdate': { userId, updateData } };
      console.log(error);

      throw error;
    }
  }
  /**
   *
   * @param {String} userId
   * @returns {string}
   */
  deleteById(userId) {
    try {
      return this.mongooseModel.deleteOne(userId).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'userDbModel.findByIdAndUpdate': { userId, updateData } };
      console.log(error);

      throw error;
    }
  }
};
