import Joi from 'joi';
import { SWITCH, VEHICLE_CITY_TYPE } from '../../enum';

export const createVehicleValidation = Joi.object({
  name: Joi.string().required(),
  capacity: Joi.number().required(),
  size: Joi.number().required(),
  description: Joi.string().required(),
  cityWise: Joi.string()
    .valid(VEHICLE_CITY_TYPE.ALL, VEHICLE_CITY_TYPE.CITY_WISE)
    .required(),
  city: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  ),
  image: Joi.string()
    .regex(
      // /data:image\/(?:bmp|gif|ico|jpg|png|svg|webp|x-icon|svg\+xml);base64,[a-zA-Z0-9+/]+={0,2}/,
      /data:image\/[bmp,gif,ico,jpg,jpeg,png,svg,webp,x\-icon,svg+xml]+;base64,[a-zA-Z0-9,+,/]+={0,2}/,
    )
    .required(),
});

export const updateVehicleValidation = Joi.object({
  name: Joi.string(),
  capacity: Joi.number(),
  size: Joi.number(),
  description: Joi.string(),
  cityWise: Joi.string().valid(
    VEHICLE_CITY_TYPE.ALL,
    VEHICLE_CITY_TYPE.CITY_WISE,
  ),
  city: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  image: Joi.string().regex(
    /data:image\/(?:bmp|gif|ico|jpg|png|jpeg|svg|webp|x-icon|svg\+xml);base64,[a-zA-Z0-9+/]+={0,2}/,
  ),
  vehicleId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const deleteVehicleValidation = Joi.object({
  vehicleId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  status: Joi.string()
    .valid(SWITCH.ENABLE, SWITCH.DISABLE)
    .default(SWITCH.DISABLE),
});
