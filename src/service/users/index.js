module.exports = class UserService {
  constructor({ userDbModel, eventEmitter }) {
    this.userDbModel = userDbModel;
    this.eventEmitter = eventEmitter;
  }

  update = async (id, body, currentUser) => {
    try {
      const { name, isApproved } = body;

      let user;

      if (currentUser.role === 'admin') {
        user = await this.userDbModel.findByIdAndUpdate(id, {
          isApproved
        });
      } else if (currentUser._id.toString() === id.toString()) {
        if (!name) {
          error = new Error('Name is required');
          error.status = 422;
          throw error;
        }

        user = await this.userDbModel.findByIdAndUpdate(id, {
          name
        });
      } else {
        error = new Error('you cannot update other user');
        error.status = 422;
        throw error;
      }

      return user;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  fetchAll = async user => {
    try {
      let users = null;
      let error;
      if (user.role !== 'admin') {
        error = new Error('Sorry you cant see this users');
        error.status = 422;
        throw error;
      }
      users = await this.userDbModel.findAll(user.organizationId);

      return users;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  fetchOne = async (id, currentUser) => {
    try {
      let user;
      let error;
      if (currentUser.role !== 'admin' || currentUser._id.toString() !== id.toString()) {
        error = new Error('Sorry you cant view this user');
        error.status = 422;
        throw error;
      }

      user = await this.userDbModel.findById(id);

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};
