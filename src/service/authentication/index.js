const moment = require('moment');
const randomstring = require('randomstring');
const { OAuth2Client } = require('google-auth-library');

const { CLIENT_ID } = require('../../../config/env.json');

const client = new OAuth2Client(process.env.CLIENT_ID || CLIENT_ID);

const { signToken, isKeyExpired } = require('../../helpers/user');

module.exports = class AuthenticationService {
  constructor({ userDbModel, organizationDbModel }) {
    this.userDbModel = userDbModel;
    this.organizationDbModel = organizationDbModel;
    this.accessTokenValidity = 60 * 60; // 60mins
  }

  authenticateUserByToken(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userDbModel.findById(payload._id);

        if (user && user.key === payload.key) {
          return resolve({ success: true, user });
        }

        return resolve({ success: false });
      } catch (error) {
        reject(error);
      }
    });
  }

  async authenticateUserByGoogleToken(body) {
    return new Promise(async (resolve, reject) => {
      try {
        const { googleToken, name, role, organization, organizationId } = body;
        let user = null;

        const ticket = await client.verifyIdToken({
          idToken: googleToken,
          audience: process.env.CLIENT_ID || CLIENT_ID
        });
        const { email } = ticket.getPayload();

        const userByEmail = await this.userDbModel.findByEmail(email);

        if (!userByEmail) {
          if (!name) {
            return resolve({
              success: false,
              done: {
                message: 'Name is required',
                status: 422
              }
            });
          }

          if (!role || !['admin', 'user'].includes(role)) {
            return resolve({
              success: false,
              done: {
                message: 'Role is required',
                status: 422
              }
            });
          }

          const key = `${Date.now()}${randomstring.generate()}`;
          const keyExpiry = moment()
            .add(3, 'M')
            .seconds(0)
            .format();

          if (role === 'admin') {
            const organizationNew = await this.organizationDbModel.create({ name: organization });

            user = await this.userDbModel.create({
              name,
              email,
              uniqueId: randomstring.generate(),
              organizationId: organizationNew._id,
              role,
              key,
              keyExpiry
            });
          } else {
            if (!organizationId) {
              return resolve({
                success: false,
                done: {
                  message: 'Organization is required',
                  status: 422
                }
              });
            }

            const organizationById = await this.organizationDbModel.findById(organizationId);

            if (!organizationById) {
              return resolve({
                success: false,
                done: {
                  message: 'Organization not found',
                  status: 404
                }
              });
            }

            user = await this.userDbModel.create({
              name,
              email,
              uniqueId: randomstring.generate(),
              organizationId,
              role,
              key,
              keyExpiry
            });
          }
        } else {
          if (!userByEmail.key || isKeyExpired(userByEmail.keyExpiry)) {
            const key = `${Date.now()}${randomstring.generate()}`;
            const keyExpiry = moment()
              .add(3, 'M')
              .seconds(0)
              .format();

            user = await this.userDbModel.findByIdAndUpdate(userByEmail._id, {
              key,
              keyExpiry
            });
          }
        }

        const token = await signToken({ _id: user._id, key: user.key }, this.accessTokenValidity);

        return resolve({ token: `JWT ${token}`, user, success: true });
      } catch (error) {
        reject(error);
      }
    });
  }

  // async refreshAccessToken(user:any) {
  //   try {

  //     if (isKeyExpired(user.keyExpiry)) {
  //       const key = `${Date.now()}${randomstring.generate()}`;
  //       // set key expiry for 3 months
  //       const keyExpiry = moment().add(3, "M").seconds(0).format();

  //       // update key & keyExpiry in DB
  //       await this.userDbModel.findByIdAndUpdate(user._id, {
  //         key,
  //         keyExpiry,
  //       });
  //       // fetch updated user
  //       user = await this.userDbModel.findByIdForAuth(user._id);
  //     }

  //     const token = await signToken(
  //       { _id: user._id, key: user.key },
  //       this.accessTokenValidity
  //     );

  //     return token;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
};
