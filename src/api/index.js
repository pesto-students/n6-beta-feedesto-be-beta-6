const express = require('express');
const authRouter = require('./auth/routes');

const router = express.Router();
router.use('/auth', authRouter);
// router.use('/user', authRouter);
// router.use('/discussion', authRouter);

module.exports = router;
