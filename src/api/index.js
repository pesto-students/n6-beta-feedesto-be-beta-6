const express = require('express');
const authRouter = require('./auth/routes');

const { container } = require('../../awilix');
const { requireUserAuth } = require('./authentication');

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
// router.use('/discussion',(req,res,next)=>{req.container=container; next()}, authRouter);

module.exports = router;
