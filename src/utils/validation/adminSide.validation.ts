import Joi from 'joi';
import {
  ADMIN_ORDER_LOCATIONS,
  ORDER_LIST,
  SUBCRIPTION_REQUEST,
  SWITCH,
  TRANSACTION_TYPE,
} from '../../enum';

export const createParcelValidation = Joi.object({
  label: Joi.string().required(),
});

export const updateParcelValidation = Joi.object({
  label: Joi.string(),
  parcelTypeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const deleteParcelValidation = Joi.object({
  status: Joi.string().valid(SWITCH.ENABLE, SWITCH.DISABLE),
  parcelTypeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const adminSignInValidation = Joi.object({
  email: Joi.string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
});

export const deliveryManListValidation = Joi.object({
  pageCount: Joi.number().required(),
  pageLimit: Joi.number().required(),
  searchValue: Joi.string(),
  isVerified: Joi.boolean().required(),
});

export const paginationValidation = Joi.object({
  pageCount: Joi.number().required(),
  pageLimit: Joi.number().required(),
});

export const manageSubscriptionValidation = Joi.object({
  type: Joi.string(),
  amount: Joi.string(),
  discount: Joi.number(),
  features: Joi.array().items(Joi.string()),
  days: Joi.number(),
  subscriptionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
});
export const subscription = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'Subscription ID is required',
    'string.base': 'Subscription ID must be a string',
  }),
})

export const subcriptionStatusValidation = Joi.object({
  subscriptionId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  subscriptionStatus: Joi.string().valid(
    SUBCRIPTION_REQUEST.APPROVED,
    SUBCRIPTION_REQUEST.REJECT,
  ),
});

export const subcriptionStatusListValidation = Joi.object({
  isSubscribed: Joi.string().required(),
  pageCount: Joi.number().required(),
  pageLimit: Joi.number().required(),
});

export const orderLocationValidation = Joi.object({
  status: Joi.string()
    .valid(
      ADMIN_ORDER_LOCATIONS.ACCEPTED,
      ADMIN_ORDER_LOCATIONS.ASSIGNED,
      ADMIN_ORDER_LOCATIONS.ARRIVED,
      ADMIN_ORDER_LOCATIONS.PICKED_UP,
      ADMIN_ORDER_LOCATIONS.DEPARTED,
    )
    .required(),
});

export const deliveryManIdValidation = Joi.object({
  deliveryManId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const orderWiseDeliveryManValidation = Joi.object({
  orderId: Joi.number().required(),
  pageCount: Joi.number().required(),
  pageLimit: Joi.number().required(),
});

export const deliveryManWalletListValidation = Joi.object({
  deliveryManId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  transactionType: Joi.string()
    .valid(TRANSACTION_TYPE.DEPOSIT, TRANSACTION_TYPE.WITHDRAW)
    .required(),
  pageCount: Joi.number().required(),
  pageLimit: Joi.number().required(),
});

export const userWalletListValidation = Joi.object({
  transactionStatus: Joi.string()
    .valid(
      SUBCRIPTION_REQUEST.APPROVED,
      SUBCRIPTION_REQUEST.PENDING,
      SUBCRIPTION_REQUEST.REJECT,
    )
    .required(),
  pageCount: Joi.number().required(),
  pageLimit: Joi.number().required(),
});

export const deliveryManOrderListValidation = Joi.object({
  deliveryManId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  pageCount: Joi.number().required(),
  pageLimit: Joi.number().required(),
  orderListType: Joi.string()
    .valid(ORDER_LIST.PENDING, ORDER_LIST.COMPLETED)
    .required(),
});

export const verificationStatusValidation = Joi.object({
  deliveryManId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  documentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  status: Joi.string()
    .valid(SUBCRIPTION_REQUEST.APPROVED, SUBCRIPTION_REQUEST.REJECT)
    .required(),
});
