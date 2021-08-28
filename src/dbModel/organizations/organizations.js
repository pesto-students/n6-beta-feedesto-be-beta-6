const OrganizationModel = require('./schema');

module.exports = class OrganizationDbModel {
  constructor({ db }) {
    this.mongooseModel = OrganizationModel(db);
  }

  /**
   * find all organizations
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
   * create organization
   * @param {Object} organization object
   * @return {Object}
   */
  create(organization) {
    try {
      return this.mongooseModel.create(organization);
    } catch (error) {
      error.meta = { ...error.meta, 'organizationDbModel.create': { organization } };
      console.log(error);

      throw error;
    }
  }

  /**
   * find a specific organization document by ID
   * @param {String} organizationId
   * @return {Object}
   */
  findById(organizationId) {
    try {
      return this.mongooseModel.findById(organizationId).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'organizationDbModel.findById': { organizationId } };
      console.log(error);

      throw error;
    }
  }

  /**
   * find a specific organization document and update it
   * @param {String} organizationId: organizationId used to find the document to update
   * @param {Object} updateData: update data that needs to be pushed to the db
   * @return {Object}
   */
  findByIdAndUpdate(organizationId, updateData) {
    try {
      return this.mongooseModel.findByIdAndUpdate(organizationId, updateData, { new: true }).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'organizationDbModel.findByIdAndUpdate': { organizationId, updateData } };
      console.log(error);

      throw error;
    }
  }
  /**
   *
   * @param {String} organizationId
   * @returns {string}
   */
  deleteById(organizationId) {
    try {
      return this.mongooseModel.deleteOne(organizationId).lean();
    } catch (error) {
      error.meta = { ...error.meta, 'organizationDbModel.findByIdAndUpdate': { organizationId, updateData } };
      console.log(error);

      throw error;
    }
  }
};
