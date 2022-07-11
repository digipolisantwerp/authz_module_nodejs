const PermissionError = require('../errors/permission.error');
const permissionsService = require('./permissions.service');
const { logger } = require('../helper/logging.helper');
const difference = require('../helper/difference.helper');
const config = require('../config');
const {
  DISABLED_CONFIGURATION,
  PERMISSION_FORMAT_INVALID,
  PERMISSION_MISSING,
  SOURCE_INVALID,
  SOURCE_MISSING,
  TOKEN_MISSING,
} = require('../errors/error.messages');

// eslint-disable-next-line default-param-last
function checkPermissions(requiredPermissions = [], foundPermissions) {
  const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  const missingPermissions = difference(required, foundPermissions);

  if (!Array.isArray(foundPermissions)) {
    throw new PermissionError(PERMISSION_FORMAT_INVALID);
  }

  if (missingPermissions.length > 0) {
    throw new PermissionError(`${PERMISSION_MISSING} ${missingPermissions.join(' ,')}`, {
      missingPermissions,
      requiredPermissions,
      foundPermissions,
    });
  }
}

// eslint-disable-next-line default-param-last
function oneOfPermissions(requiredPermissions = [], foundPermissions) {
  const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

  if (!Array.isArray(foundPermissions)) {
    throw new PermissionError(PERMISSION_FORMAT_INVALID);
  }

  const found = foundPermissions
    .find((permission) => required
      .find((requiredPermission) => (requiredPermission === permission)));
  if (!found && required.length !== 0) {
    throw new PermissionError(`${PERMISSION_MISSING} ${requiredPermissions.join(' ,')}`, {
      requiredPermissions,
      foundPermissions,
    });
  }
}

function getSource(configuration, requestedsource) {
  const { sources } = configuration;
  const source = requestedsource || configuration.source;
  if (!source) throw new PermissionError(SOURCE_MISSING);
  if (!sources[source]) throw new PermissionError(SOURCE_INVALID);
  return source;
}

async function checkPermission(authToken, requiredPermissions, requestedsource) {
  if (!authToken) throw new PermissionError(TOKEN_MISSING);
  const configuration = config.getConfig();
  if (configuration.disabled) {
    logger.error(`${DISABLED_CONFIGURATION}`, { authToken, requiredPermissions, requestedsource });
    return;
  }
  const source = getSource(configuration, requestedsource);
  const permissions = await permissionsService.getPermissions(authToken, source);
  checkPermissions(requiredPermissions, permissions);
}

async function checkOneOfPermissions(authToken, requiredPermissions, requestedsource) {
  if (!authToken) throw new PermissionError(TOKEN_MISSING);
  const configuration = config.getConfig();
  if (configuration.disabled) {
    logger.error(`${DISABLED_CONFIGURATION}`, { authToken, requiredPermissions, requestedsource });
    return;
  }
  const source = getSource(configuration, requestedsource);
  const permissions = await permissionsService.getPermissions(authToken, source);
  oneOfPermissions(requiredPermissions, permissions);
}

module.exports = {
  checkPermission,
  checkOneOfPermissions,
};
