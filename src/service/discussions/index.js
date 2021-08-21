const moment = require('moment');

module.exports = class DiscussionService {
  constructor({ discussionDbModel }) {
    this.discussionDbModel = discussionDbModel;
  }

  validate = async (
    { title, description, startTime, endTime, participantIds, viewerIds, organizationId, user },
    id
  ) => {
    try {
      let error;

      if (!organizationId) {
        error = new Error('Organization is required');
        error.status = 422;
        throw error;
      }

      if (!title) {
        error = new Error('Title is required');
        error.status = 422;
        throw error;
      }

      if (startTime && !endTime) {
        error = new Error('End time is required');
        error.status = 422;
        throw error;
      }

      if (!startTime && endTime) {
        error = new Error('Start time is required');
        error.status = 422;
        throw error;
      }

      if (startTime && endTime) {
        if (startTime && !moment(startTime).isValid()) {
          error = new Error('Start time is not valid');
          error.status = 422;
          throw error;
        } else if (!moment(endTime).isValid()) {
          error = new Error('End time is not valid');
          error.status = 422;
          throw error;
        }

        if (moment(startTime).isSameOrBefore(endTime)) {
          error = new Error('End time should not be greater than start time');
          error.status = 422;
          throw error;
        }
      }

      if (user.role !== 'admin') {
        error = new Error("Sorry you can't create discussion, please ask your admin to create it");
        error.status = 422;
        throw error;
      }

      if ((participantIds && !Array.isArray(participantIds)) || (viewerIds && !Array.isArray(viewerIds))) {
        error = new Error('Invalid participants or viewers');
        error.status = 422;
        throw error;
      }

      if (
        participantIds &&
        participantIds.length &&
        viewerIds &&
        viewerIds.length &&
        participantIds.some(id => viewerIds.includes(id))
      ) {
        error = new Error('Same person is selected in participants and viewers list');
        error.status = 422;
        throw error;
      }

      if ((participantIds && participantIds.length) || (viewerIds && viewerIds.length)) {
        let usersOfCurrentOrganization = await this.userDbModel.findAllActiveIdsByOrganizationId(user.organizationId);

        if (!usersOfCurrentOrganization || !usersOfCurrentOrganization.length) {
          error = new Error('There are no active users present in this organization');
          error.status = 422;
          throw error;
        }

        usersOfCurrentOrganization = usersOfCurrentOrganization.map(c => c._id.toString());

        if (participantIds.some(id => !usersOfCurrentOrganization.includes(id))) {
          error = new Error(
            'You can only select users as participants that belong to this organization and are approved by the you'
          );
          error.status = 422;
          throw error;
        }

        if (viewerIds.some(id => !usersOfCurrentOrganization.includes(id))) {
          error = new Error(
            'You can only select users as viewers that belong to this organization and are approved by the you'
          );
          error.status = 422;
          throw error;
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  create = async (body, user) => {
    try {
      const { title, description, startTime, endTime, participantIds = [], viewerIds = [] } = body;

      await this.validate({
        title,
        description,
        startTime,
        endTime,
        participantIds,
        viewerIds,
        organizationId: user.organizationId,
        user
      });

      const discussion = await this.discussionDbModel.create({
        title,
        description,
        startTime: startTime ? moment(startTime).toDate() : undefined,
        endTime: endTime ? moment(endTime).toDate() : undefined,
        participantIds,
        organizationId: user.organizationId,
        viewerIds,
        createdById: user._id
      });
      return discussion;
    } catch (error) {
      throw error;
    }
  };

  fetchAll = async user => {
    try {
      let discussions = null;
      if (user.role === 'admin') {
        discussions = await this.discussionDbModel.findAll(user.organizationId);
      } else {
        discussions = await this.discussionDbModel.findAll(user.organizationId, user._id);
      }
      return discussions;
    } catch (error) {
      throw error;
    }
  };

  fetchOne = async (id, user) => {
    try {
      let discussion = null;
      if (user.role === 'admin') {
        discussion = await this.discussionDbModel.findByIdFormatted(id, user.organizationId);
      } else {
        discussion = await this.discussionDbModel.findByIdFormatted(id, user.organizationId, user._id);
      }
      return discussion;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};
