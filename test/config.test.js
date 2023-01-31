const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
const config = require('../lib/config');
const logginghelper = require('../lib/helper/logging.helper');
const errorMessages = require('../lib/errors/error.messages');

describe('Config', () => {
  let sandbox;

  const baseConfig = {
    source: 'authzv2',
    sources: {
      authzv2: {
        url: 'test/url',
        apiKey: 'test',
        applicationId: 'test',
      },
    },
  };

  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    done();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('setConfig({}) shouldn`t be overridden', () => {
    expect(config.setConfig(baseConfig)).to.eql({ ...baseConfig, set: true });
    expect(config.setConfig({ ...baseConfig, source: 'meauthzv2' })).to.eql({
      ...baseConfig,
      set: true,
    });
    expect(config.getConfig()).to.eql({ ...baseConfig, set: true });
  });
  it('setConfig({}, true) with force should override', () => {
    expect(config.setConfig(baseConfig)).to.eql({ ...baseConfig, set: true });
    expect(
      config.setConfig({ ...baseConfig, source: 'meauthzv2' }, true),
    ).to.eql({
      ...baseConfig,
      source: 'meauthzv2',
      set: true,
    });
    expect(config.getConfig()).to.eql({
      ...baseConfig,
      source: 'meauthzv2',
      set: true,
    });
  });
  it('Double setConfig({}) should log error in debugmodus', () => {
    const logging = sandbox.spy(logginghelper.logger, 'error');
    const oldconfig = config.getConfig();
    expect(config.setConfig(oldconfig)).to.eql(oldconfig);
    expect(config.setConfig({ ok: 'okk', debug: true })).to.eql(oldconfig);
    sinon.assert.calledWith(logging, errorMessages.DOUBLE_CONFIG);
  });
  it('Double setConfig({}, true) force should log warn in debugmodus', () => {
    const logging = sandbox.spy(logginghelper.logger, 'warn');
    expect(config.setConfig({ ...baseConfig, debug: true }, true)).to.eql({
      ...baseConfig,
      set: true,
      debug: true,
    });
    sinon.assert.calledWith(logging, errorMessages.FORCE_CONFIG);
  });
});
