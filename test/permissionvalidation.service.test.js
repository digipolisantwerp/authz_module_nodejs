const chai = require('chai');
const sinon = require('sinon');
const config = require('../lib/config');
const PermissionError = require('../lib/errors/permission.error');
const logginghelper = require('../lib/helper/logging.helper');
const { checkPermission, checkOneOfPermissions } = require('../lib/services/permissionvalidation.service');
const errorMessages = require('../lib/errors/error.messages');

const { expect } = chai;
const umConfig = {
  debug: true,
  source: 'authzv2',
  sources: {
    authzv2: {
      url: 'fakeurl',
      apiKey: 'fakekey',
      applicationId: 'FAKEAPP',
    },
  },
};

describe('permissionvalidation.service', () => {
  let sandbox;
  const fakeReq = {};
  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    fakeReq.get = sandbox.stub().returns('faketoken');
    done();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('Missing source', (done) => {
    sandbox.stub(config, 'getConfig').returns({ ...umConfig, source: false, debug: false });
    checkPermission('faketoken', []).then((result) => {
      throw new Error('shouldn\'t resolve', result);
    }).catch((e) => {
      try {
        expect(e).to.be.instanceof(PermissionError);
        expect(e.message).to.eql('No source defined for permissions');
        done();
      } catch (err) {
        done(err);
      }
    });
  });
  it('Missing source checkOneOfPermissions', (done) => {
    sandbox.stub(config, 'getConfig').returns({ ...umConfig, source: false, debug: false });
    checkOneOfPermissions('faketoken', []).then((result) => {
      throw new Error('shouldn\'t resolve', result);
    }).catch((e) => {
      try {
        expect(e).to.be.instanceof(PermissionError);
        expect(e.message).to.eql('No source defined for permissions');
        done();
      } catch (err) {
        done(err);
      }
    });
  });
  it('invalid source', (done) => {
    sandbox.stub(config, 'getConfig').returns({ ...umConfig, source: 'invalid', debug: false });
    checkPermission('faketoken', []).then((result) => {
      done(new Error('shouldn\'t resolve', result));
    }).catch((e) => {
      try {
        expect(e).to.be.instanceof(PermissionError);
        expect(e.message).to.eql('No valid datasource defined for permissions');
        done();
      } catch (err) {
        done(err);
      }
    });
  });
  it('invalid source checkOneOfPermissions', (done) => {
    sandbox.stub(config, 'getConfig').returns({ ...umConfig, source: 'invalid', debug: false });
    checkOneOfPermissions('faketoken', []).then((result) => {
      done(new Error('shouldn\'t resolve', result));
    }).catch((e) => {
      try {
        expect(e).to.be.instanceof(PermissionError);
        expect(e.message).to.eql('No valid datasource defined for permissions');
        done();
      } catch (err) {
        done(err);
      }
    });
  });
  it('request permissions from external service (returns invalid type) ', (done) => {
    const externalPermissionService = sandbox.stub().returns({});
    sandbox.stub(config, 'getConfig').returns({
      debug: true,
      applicationId: 'FAKEAPP',
      source: 'authzv2',
      sources: {
        authzv2: {
          url: 'fakeurl',
          apiKey: 'fakekey',
        },
        meauthzv2: {
          url: 'fakeurl',
          apiKey: 'fakekey',
        },
        externalPermissionService,
      },
    });
    checkPermission('faketoken', [], 'externalPermissionService').then((result) => {
      done(new Error('shouldn\'t resolve', result));
    }).catch((e) => {
      expect(e).to.be.instanceof(PermissionError);
      expect(e.message).to.eql('Permission service returned permissions in an unexpected format');
      done();
    });
  });
  it('request permissions from external service (returns invalid type) checkOneOfPermissions', (done) => {
    const externalPermissionService = sandbox.stub().returns({});
    sandbox.stub(config, 'getConfig').returns({
      debug: true,
      applicationId: 'FAKEAPP',
      source: 'authzv2',
      sources: {
        authzv2: {
          url: 'fakeurl',
          apiKey: 'fakekey',
        },
        meauthzv2: {
          url: 'fakeurl',
          apiKey: 'fakekey',
        },
        externalPermissionService,
      },
    });
    checkOneOfPermissions('faketoken', [], 'externalPermissionService').then((result) => {
      done(new Error('shouldn\'t resolve', result));
    }).catch((e) => {
      expect(e).to.be.instanceof(PermissionError);
      expect(e.message).to.eql('Permission service returned permissions in an unexpected format');
      done();
    });
  });
  it('Disabled config should allow everything', (done) => {
    const logging = sandbox.spy(logginghelper.logger, 'error');
    sandbox.stub(config, 'getConfig').returns({
      debug: false,
      disabled: true,
      applicationId: 'FAKEAPP',
      source: 'authzv2',
      sources: {
      },
    });
    checkPermission('faketoken', ['a', 'b'], 'abccab').then(() => {
      sinon.assert.calledWith(logging, errorMessages.DISABLED_CONFIGURATION, {
        authToken: 'faketoken',
        requiredPermissions: ['a', 'b'],
        requestedsource: 'abccab',
      });
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Disabled config should allow everything checkOneOfPermissions', (done) => {
    const logging = sandbox.spy(logginghelper.logger, 'error');
    sandbox.stub(config, 'getConfig').returns({
      debug: false,
      disabled: true,
      applicationId: 'FAKEAPP',
      source: 'authzv2',
      sources: {
      },
    });
    checkOneOfPermissions('faketoken', ['a', 'b'], 'abccab').then(() => {
      sinon.assert.calledWith(logging, errorMessages.DISABLED_CONFIGURATION, {
        authToken: 'faketoken',
        requiredPermissions: ['a', 'b'],
        requestedsource: 'abccab',
      });
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Disabled config should allow everything (debug)', (done) => {
    const logging = sandbox.spy(logginghelper.logger, 'error');
    sandbox.stub(config, 'getConfig').returns({
      debug: true,
      disabled: true,
      applicationId: 'FAKEAPP',
      source: 'authzv2',
      sources: {
      },
    });
    checkPermission('faketoken', ['a', 'b'], 'abccab').then(() => {
      sinon.assert.calledWith(logging, errorMessages.DISABLED_CONFIGURATION, {
        authToken: 'faketoken',
        requiredPermissions: ['a', 'b'],
        requestedsource: 'abccab',
      });
      done();
    }).catch((e) => {
      done(e);
    });
  });
});
