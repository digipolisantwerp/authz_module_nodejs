const { checkPermission, checkOneOfPermissions } = require('./services/permissionvalidation.service');
const config = require('./config');
const { getPermissions } = require('./services/permissions.service');
const { hasPermission, hasOneOfPermissions, hasPermissions } = require('./middlewares/haspermission.middleware');

module.exports = {
  checkOneOfPermissions,
  checkPermission,
  config: config.setConfig,
  getConfig: config.getConfig,
  getPermissions,
  hasOneOfPermissions,
  hasPermission,
  hasPermissions,
};
