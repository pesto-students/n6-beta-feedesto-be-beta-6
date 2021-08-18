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
    numberOfUpVotes: {
      type: Number,
      default: 0,
      min: 0
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    numberOfDownVotes: {
      type: Number,
      default: 0,
      min: 0
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
