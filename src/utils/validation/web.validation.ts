import Joi from "joi";

export const webNavbarValidation = Joi.object({
    _id: Joi.string().optional(),
    logo: Joi.object({
        img: Joi.string().required(),
        path: Joi.string().required(),
    }).required(),
    menuList: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        path: Joi.string().required(),
        _id: Joi.string().optional(),
    })).required(),
    favicon: Joi.object({
        img: Joi.string().required(),
        path: Joi.string().required(),
    }).required(),
    __v: Joi.number().optional(),
  });
  