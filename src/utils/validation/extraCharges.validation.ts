import Joi from 'joi';
import { CHARGE_TYPE, SWITCH } from '../../enum';

export const createExtraChargesValidation = Joi.object({
  title: Joi.string().required(),
  charge: Joi.number().required(),
  chargeType: Joi.string()
    .valid(CHARGE_TYPE.FIXED, CHARGE_TYPE.PERCENTAGE)
    .required(),
  country: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  city: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  cashOnDelivery: Joi.boolean(),
});

export const updateExtraChargesValidation = Joi.object({
  title: Joi.string(),
  charge: Joi.number(),
  chargeType: Joi.string().valid(CHARGE_TYPE.FIXED, CHARGE_TYPE.PERCENTAGE),
  country: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  city: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  cashOnDelivery: Joi.boolean(),
  extraChargeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const deleteExtraChargesValidation = Joi.object({
  extraChargeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  status: Joi.string()
    .valid(SWITCH.ENABLE, SWITCH.DISABLE)
    .default(SWITCH.DISABLE),
});
