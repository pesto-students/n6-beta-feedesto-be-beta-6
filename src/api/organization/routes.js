const express = require('express');

const organization = require('./organization');

const organizationRoutes = express.Router();

organizationRoutes.get('/', organization.fetchAll);

module.exports = organizationRoutes;
