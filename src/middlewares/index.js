const { json } = require('express');
const disablePoweredBy = require('./disablePoweredBy');
const requestId = require('./requestId');

module.exports = (app) => {
  app.use(json());

  app.use(disablePoweredBy);

  app.use(requestId);
};