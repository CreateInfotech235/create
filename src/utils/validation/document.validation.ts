import Joi from 'joi';
import { SWITCH } from '../../enum';

export const createDocumentValidation = Joi.object({
  name: Joi.string().required(),
  isRequired: Joi.boolean().required(),
});

export const updateDocumentValidation = Joi.object({
  name: Joi.string().required(),
  isRequired: Joi.boolean().required(),
  documentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const deleteDocumentValidation = Joi.object({
  status: Joi.string().valid(SWITCH.ENABLE, SWITCH.DISABLE).required(),
  documentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
