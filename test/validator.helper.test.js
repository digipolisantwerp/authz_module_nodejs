const { expect } = require('chai');
const validateConfig = require('../lib/helper/validator.helper');

describe('validator.helper', () => {
  it('Validate config', () => {
    const config = {
      debug: true,
      cache: true,
      source: 'authzv2',
      sources: {
        authzv2: {
          url: 'fakeurl',
          apiKey: 'fakekey',
          applicationId: 'FAKEAPP',
        },
      },
    };

    try {
      const result = validateConfig(config);
      expect(result).to.deep.equal(config);
    } catch (err) {
      expect(err).to.eql(undefined);
    }
  });

  it('Invalid config (invalid source property)', () => {
    const config = {
      debug: true,
      cache: true,
      source: 'invalidSource',
      sources: {
        authzv2: {
          url: 'fakeurl',
          apiKey: 'fakekey',
          applicationId: 'FAKEAPP',
        },
      },
    };

    try {
      validateConfig(config);
    } catch (e) {
      expect(e.message).to.eql('"source" must be one of [authzv2, meauthzv2, meauthz, externalAuthz]');
    }
  });

  it('Invalid config (No externalAuthz source set)', () => {
    const config = {
      debug: true,
      cache: true,
      source: 'externalAuthz',
      sources: {
        authzv2: {
          url: 'fakeurl',
          apiKey: 'fakekey',
          applicationId: 'FAKEAPP',
        },
      },
    };

    try {
      validateConfig(config);
    } catch (e) {
      expect(e.message).to.eql('"sources.externalAuthz" is required');
    }
  });
});
