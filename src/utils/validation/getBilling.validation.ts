import Joi from 'joi';
import { CHARGE_TYPE, SWITCH } from '../../enum';

export const billingValidation = Joi.object({
  deliveryBoyId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  merchantId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});