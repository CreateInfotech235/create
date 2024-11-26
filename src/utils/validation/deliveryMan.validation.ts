import Joi from 'joi';

export const updateLocationValidation = Joi.object({
  country: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  city: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
});
