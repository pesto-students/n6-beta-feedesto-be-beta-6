const Schema = require('mongoose').Schema;

const DiscussionSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    participantIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    viewerIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    upvoteIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    downVoteIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongooseConnection => {
  // return an instance of the db model
  return mongooseConnection.model('Discussion', DiscussionSchema);
};
