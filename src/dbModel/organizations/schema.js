const Schema = require('mongoose').Schema;

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    sector: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongooseConnection => {
  // return an instance of the db model
  return mongooseConnection.model('Organization', OrganizationSchema);
};
