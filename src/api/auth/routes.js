const express = require('express');

const { requireUserLogin, authError } = require('../authentication');

const router = express.Router();

router.post(
  '/login',
  requireUserLogin,
  (req, res, next) => {
    if (req.user && req.user.success) {
      res.status(302).json({
        success: true,
        user: req.user.user,
        token: req.user.token
      });
    } else {
      next({}, req, res, next);
    }
  },
  authError
);

module.exports = router;
