import Joi from 'joi';
import { CHARGE_TYPE, PICKUP_REQUEST } from '../../enum';

export const createDayWiseChargeValidation = Joi.object({
  cityId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  productChargeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  fixedCharge: Joi.number().required(),
  title: Joi.string().required(),
  hours: Joi.number().required(),
});

export const updateDayWiseChargeValidation = Joi.object({
  cityId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  productChargeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  dayNumber: Joi.number().required(),
  fixedCharge: Joi.number(),
  title: Joi.string(),
  hours: Joi.number(),
});

export const createCityValidation = Joi.object({
  cityName: Joi.string().required(),
  countryID: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  cancelCharge: Joi.number().required(),
  minimumDistance: Joi.number().required(),
  minimumWeight: Joi.number().required(),
  perDistanceCharge: Joi.number().required(),
  perWeightCharge: Joi.number().required(),
  commissionType: Joi.string()
    .valid(CHARGE_TYPE.FIXED, CHARGE_TYPE.PERCENTAGE)
    .required(),
  adminCommission: Joi.number().required(),
  pickupRequest: Joi.string()
    .valid(PICKUP_REQUEST.REGULAR, PICKUP_REQUEST.EXPRESS)
    .required(),
});

export const updateCityValidation = Joi.object({
  cityName: Joi.string(),
  countryID: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  cancelCharge: Joi.number(),
  minimumDistance: Joi.number(),
  minimumWeight: Joi.number(),
  perDistanceCharge: Joi.number(),
  perWeightCharge: Joi.number(),
  commissionType: Joi.string().valid(CHARGE_TYPE.FIXED, CHARGE_TYPE.PERCENTAGE),
  adminCommission: Joi.number(),
  pickupRequest: Joi.string().valid(
    PICKUP_REQUEST.REGULAR,
    PICKUP_REQUEST.EXPRESS,
  ),
  cityId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const cityListValidation = Joi.object({
  cityName: Joi.string(),
  pageCount: Joi.number().required(),
  pageLimit: Joi.number().required(),
});

export const dayChargesListValidation = Joi.object({
  productChargeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  pageCount: Joi.number().required(),
  pageLimit: Joi.number().required(),
});
