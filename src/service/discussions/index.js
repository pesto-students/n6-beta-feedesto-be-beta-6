const moment = require('moment');

module.exports = class DiscussionService {
  constructor({ discussionDbModel, commentDbModel, eventEmitter }) {
    this.discussionDbModel = discussionDbModel;
    this.commentDbModel = commentDbModel;
    this.eventEmitter = eventEmitter;
  }

  validateByUserUpdate = async ({ comment, user }, id) => {
    try {
      let error;

      if (id) {
        const discussion = await this.discussionDbModel.findById(id);
        if (comment && discussion && !discussion.participantIds.map(c => c.toString()).includes(user._id.toString())) {
          error = new Error("Sorry you can't reply to this discussion");
          error.status = 422;
          throw error;
        }
      }

      return true;
    } catch (erro) {
      console.log(error);
      throw error;
    }
  };

  validate = async (
    { title, description, comment, startTime, endTime, participantIds, viewerIds, organizationId, user },
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
      console.log(error);

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

      (participantIds || []).forEach(user =>
        this.eventEmitter.emit('emitToFrontEnd', {
          topic: `${discussion.organizationId}-${user}`,
          object: discussion,
          model: 'discussion',
          action: 'create'
        })
      );
      (viewerIds || []).forEach(user =>
        this.eventEmitter.emit('emitToFrontEnd', {
          topic: `${discussion.organizationId}-${user}`,
          object: discussion,
          model: 'discussion',
          action: 'create'
        })
      );

      return discussion;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  update = async (id, body, user) => {
    try {
      const { title, description, startTime, endTime, participantIds = [], viewerIds = [], comment = '' } = body;

      let discussion;

      if (user.role === 'admin') {
        await this.validate({
          title,
          comment,
          description,
          startTime,
          endTime,
          participantIds,
          viewerIds,
          organizationId: user.organizationId,
          user,
          id
        });

        discussion = await this.discussionDbModel.findByIdAndUpdate(id, {
          title,
          description,
          startTime: startTime ? moment(startTime).toDate() : undefined,
          endTime: endTime ? moment(endTime).toDate() : undefined,
          participantIds,
          organizationId: user.organizationId,
          viewerIds,
          createdById: user._id
        });

        await this.commentDbModel.create({
          title: comment,
          commentedById: user._id,
          commentableId: id,
          commentableType: 'Discussion',
          organizationId: user.organizationId
        });
      } else {
        await this.validateByUserUpdate({ user, commet }, id);

        await this.commentDbModel.create({
          title: comment,
          commentedById: user._id,
          commentableId: id,
          commentableType: 'Discussion',
          organizationId: user.organizationId
        });
      }

      return this.fetchOne(id, user, true);
    } catch (error) {
      console.log(error);

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
      console.log(error);

      throw error;
    }
  };

  fetchOne = async (id, user, isUpdated) => {
    try {
      let discussion = null;
      let comments = null;
      if (user.role === 'admin') {
        discussion = await this.discussionDbModel.findByIdFormatted(id, user.organizationId);
        comments = await this.commentDbModel.findAllByDisscussionId(id);
      } else {
        discussion = await this.discussionDbModel.findByIdFormatted(id, user.organizationId, user._id);
        comments = await this.commentDbModel.findAllByDisscussionId(id, user._id);
      }

      if (isUpdated) {
        (discussion.participantIds || []).forEach(user =>
          this.eventEmitter.emit('emitToFrontEnd', {
            topic: `${discussion.organizationId}-${user}`,
            object: { ...discussion, comments },
            model: 'discussion',
            action: 'update'
          })
        );
        (discussion.viewerIds || []).forEach(user =>
          this.eventEmitter.emit('emitToFrontEnd', {
            topic: `${discussion.organizationId}-${user}`,
            object: { ...discussion, comments },
            model: 'discussion',
            action: 'update'
          })
        );
      }

      return { ...discussion, comments };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  delete = async (id, user) => {
    try {
      let error;

      if (user.role !== 'admin') {
        error = new Error('you dont have permissions to delete the discussion');
        error.status = 422;
        throw error;
      }

      const oldDiscussion = await this.discussionDbModel.findById(id);

      if (!oldDiscussion) {
        error = new Error('Discussion is not found');
        error.status = 404;
        throw error;
      }

      await this.discussionDbModel.deleteById(id);
      await this.commentDbModel.deleteByDiscussionId(id);

      (oldDiscussion.participantIds || []).forEach(user =>
        this.eventEmitter.emit('emitToFrontEnd', {
          topic: `${oldDiscussion.organizationId}-${user}`,
          object: oldDiscussion,
          model: 'discussion',
          action: 'create'
        })
      );
      (oldDiscussion.viewerIds || []).forEach(user =>
        this.eventEmitter.emit('emitToFrontEnd', {
          topic: `${oldDiscussion.organizationId}-${user}`,
          object: oldDiscussion,
          model: 'discussion',
          action: 'create'
        })
      );

      return { discussion: id };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};
