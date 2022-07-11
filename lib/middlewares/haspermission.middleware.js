const get = require('../helper/get.helper');
const config = require('../config');
const { checkPermission, checkOneOfPermissions } = require('../services/permissionvalidation.service');

function getTokenFromReq(req) {
  const { tokenLocation } = config.getConfig();
  return get(req, tokenLocation);
}

function hasPermission(requiredPermissions, source) {
  return async (req, res, next) => {
    try {
      const token = getTokenFromReq(req);
      await checkPermission(token, requiredPermissions, source);
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

function hasOneOfPermissions(requiredPermissions, source) {
  return async (req, res, next) => {
    try {
      const token = getTokenFromReq(req);
      await checkOneOfPermissions(token, requiredPermissions, source);

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {
  hasPermission,
  hasPermissions: hasPermission,
  hasOneOfPermissions,
};
