import Joi from 'joi';
import { DISTANCE_TYPE, WEIGHT_TYPE } from '../../enum';

export const createCountryValidation = Joi.object({
  countryName: Joi.string().required(),
  distanceType: Joi.string()
    .valid(DISTANCE_TYPE.KM, DISTANCE_TYPE.MILES)
    .required(),
  weightType: Joi.string().valid(WEIGHT_TYPE.KG, WEIGHT_TYPE.POUND).required(),
});

export const updateCountryValidation = Joi.object({
  countryName: Joi.string(),
  distanceType: Joi.string().valid(DISTANCE_TYPE.KM, DISTANCE_TYPE.MILES),
  weightType: Joi.string().valid(WEIGHT_TYPE.KG, WEIGHT_TYPE.POUND),
  currency: Joi.string(),
  countryId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const countryWiseCityValidation = Joi.object({
  countryId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  pageCount: Joi.number().required(),
  pageLimit: Joi.number().required(),
});
