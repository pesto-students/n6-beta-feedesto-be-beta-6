const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { JWT_SECRET } = require('../../config/env.json');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET || JWT_SECRET,
  passReqToCallback: true
};

const jwtLogin = new JwtStrategy(jwtOptions, async (req, payload, done) => {
  try {
    const authenticationService = req.container.resolve('authenticationService');
    const response = await authenticationService.authenticateUserByToken(payload);
    if (response.success) return done(null, response.user);
    done(null, false);
  } catch (error) {
    error.status = 401;
    done(error);
  }
});

const localOptions = {
  // key in the request body that will be passed to the callback
  usernameField: 'name',
  passwordField: 'googleToken',
  // set this to true to get access to req in the callback along with usernameField, password and done callbacks
  passReqToCallback: true
};

const localLogin = new LocalStrategy(localOptions, async (req, name, googleToken, done) => {
  try {
    const authenticationService = req.container.resolve('authenticationService');
    const response = await authenticationService.authenticateUserByGoogleToken(req.body);

    if (response.success) return done(null, response);
    done(response.done, false, null);
  } catch (error) {
    error.status = 401;
    done(error);
  }
});

passport.use('jwt', jwtLogin);
passport.use('local', localLogin);

const requireUserAuth = passport.authenticate('jwt', {
  session: false,
  failWithError: true
});

const requireUserLogin = passport.authenticate('local', {
  session: false,
  failWithError: true
});

const authError = (err, req, res, next) => {
  res
    .status(err.status || 401)
    .json(err.status ? { success: false, message: err.message } : { success: false, message: 'Something went wrong' });
};

module.exports = {
  authError,
  requireUserLogin,
  requireUserAuth
};
