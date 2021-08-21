module.exports = class OrganizationService {
  constructor({ organizationDbModel }) {
    this.organizationDbModel = organizationDbModel;
  }

  create = async (body, user) => {
    try {
      const { name } = body;
      const organization = await this.organizationDbModel.create({ name });
      return organization;
    } catch (error) {
      throw error;
    }
  };

  fetchAll = async user => {
    try {
      const organizations = await this.organizationDbModel.findAll();
      return organizations;
    } catch (error) {
      throw error;
    }
  };
};
