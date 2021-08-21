const Schema = require('mongoose').Schema;

const CommentSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    commentedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    commentableType: {
      type: String,
      enum: ['Discussion', 'Comment'],
      index: true,
      required: true
    },
    discussionId: {
      type: Schema.Types.ObjectId,
      ref: 'Discussion',
      index: true,
      required: true
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      index: true,
      required: true
    },
    upVoteIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      index: true,
      default: []
    },
    childrenIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
      index: true
    },
    downVoteIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      index: true,
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongooseConnection => {
  // return an instance of the db model
  return mongooseConnection.model('Comment', CommentSchema);
};
