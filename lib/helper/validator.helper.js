const Joi = require('joi');

const configSchema = Joi.object({
  debug: Joi.boolean().optional(),
  disabled: Joi.boolean().optional(),
  cache: Joi.boolean().optional(),
  tokenLocation: Joi.string().optional(),
  source: Joi.string()
    .valid('authzv2', 'meauthzv2', 'externalAuthz')
    .required(),
  sources: Joi.when('source', {
    switch: [
      {
        is: 'externalAuthz',
        then: Joi.object({
          externalAuthz: Joi.function().required(),
        }),
      },
      {
        is: 'authzv2',
        then: Joi.object({
          authzv2: Joi.object({
            url: Joi.string().required(),
            apiKey: Joi.string().required(),
            applicationId: Joi.string().required(),
          }).required(),
        }),
      },
      {
        is: 'meauthzv2',
        then: Joi.object({
          authzv2: Joi.object({
            url: Joi.string().required(),
            apiKey: Joi.string().required(),
            applicationId: Joi.string().required(),
          }).required(),
        }),
      },
    ],
  }).required(),
}).required();

const validateConfig = (config) => {
  const { error, value } = configSchema.validate(config);
  if (error) throw error;
  return value;
};

module.exports = validateConfig;
