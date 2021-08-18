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
      required: true
    },
    commentableId: {
      type: Schema.Types.ObjectId,
      refPath: 'commentableType',
      required: true
    },
    numberOfUpVotes: {
      type: Number,
      default: 0,
      min: 0
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
  return mongooseConnection.model('Comment', CommentSchema);
};
