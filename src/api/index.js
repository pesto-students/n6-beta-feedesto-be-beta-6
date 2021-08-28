const express = require('express');

const authRouter = require('./auth/routes');

const { container } = require('../awilix');

const { requireUserAuth } = require('./authentication');

const organizationRoutes = require('./organization/routes');
const discussionRoutes = require('./discussion/routes');
const commentRoutes = require('./comment/routes');
const userRoutes = require('./user/routes');

const router = express.Router();
router.use(
  '/auth',
  (req, res, next) => {
    req.container = container;
    next();
  },
  authRouter
);
//  router.use('/user',(req,res,next)=>{req.container=container; next()},requireUserAuth,()=>{re}, authRouter);
router.use(
  '/discussion',
  (req, res, next) => {
    req.container = container;
    next();
  },
  requireUserAuth,
  discussionRoutes
);

router.use(
  '/user',
  (req, res, next) => {
    req.container = container;
    next();
  },
  requireUserAuth,
  userRoutes
);

router.use(
  '/comment',
  (req, res, next) => {
    req.container = container;
    next();
  },
  requireUserAuth,
  commentRoutes
);

router.use(
  '/organization',
  (req, res, next) => {
    req.container = container;
    next();
  },
  organizationRoutes
);

module.exports = router;
