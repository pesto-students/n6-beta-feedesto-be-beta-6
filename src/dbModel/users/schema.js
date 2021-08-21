const Schema = require('mongoose').Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    key: {
      type: String
    },
    keyExpiry: {
      type: String
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    uniqueId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongooseConnection => {
  // return an instance of the db model
  return mongooseConnection.model('User', UserSchema);
};
