"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationStatusValidation = exports.deliveryManOrderListValidation = exports.userWalletListValidation = exports.deliveryManWalletListValidation = exports.orderWiseDeliveryManValidation = exports.deliveryManIdValidation = exports.orderLocationValidation = exports.subcriptionStatusListValidation = exports.subcriptionStatusValidation = exports.subscription = exports.manageSubscriptionValidation = exports.orderCount = exports.paginationValidationOp = exports.paginationValidation2 = exports.paginationValidation = exports.deliveryManListValidation = exports.adminSignInValidation = exports.deleteParcelValidation = exports.updateParcelValidation = exports.createParcelValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../../enum");
exports.createParcelValidation = joi_1.default.object({
    label: joi_1.default.string().required(),
    merchant: joi_1.default.string(),
    status: joi_1.default.string().valid(enum_1.SWITCH.ENABLE, enum_1.SWITCH.DISABLE)
});
exports.updateParcelValidation = joi_1.default.object({
    label: joi_1.default.string(),
    parcelTypeId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    status: joi_1.default.string().valid(enum_1.SWITCH.ENABLE, enum_1.SWITCH.DISABLE),
});
exports.deleteParcelValidation = joi_1.default.object({
    status: joi_1.default.string().valid(enum_1.SWITCH.ENABLE, enum_1.SWITCH.DISABLE),
    parcelTypeId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.adminSignInValidation = joi_1.default.object({
    email: joi_1.default.string()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .required(),
    password: joi_1.default.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .required(),
});
exports.deliveryManListValidation = joi_1.default.object({
    createdByAdmin: joi_1.default.boolean(),
    createdByMerchant: joi_1.default.boolean(),
    isVerified: joi_1.default.boolean().required(),
    merchantId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).allow(""),
});
exports.paginationValidation = joi_1.default.object({
    pageCount: joi_1.default.number().allow(""),
    pageLimit: joi_1.default.number().allow(""),
});
exports.paginationValidation2 = joi_1.default.object({
    pageCount: joi_1.default.number().allow(""),
    pageLimit: joi_1.default.number().allow(""),
    merchantId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).allow(""),
});
exports.paginationValidationOp = joi_1.default.object({
    pageCount: joi_1.default.number().optional(),
    pageLimit: joi_1.default.number().optional(),
});
exports.orderCount = joi_1.default.object({
    startDate: joi_1.default.string(),
    endDate: joi_1.default.string(),
});
exports.manageSubscriptionValidation = joi_1.default.object({
    type: joi_1.default.string(),
    amount: joi_1.default.number(),
    discount: joi_1.default.number(),
    features: joi_1.default.array().items(joi_1.default.string()),
    days: joi_1.default.number(),
    subscriptionId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).allow(""),
    isDesable: joi_1.default.boolean().allow(""),
});
exports.subscription = joi_1.default.object({
    id: joi_1.default.string().required().messages({
        'any.required': 'Subscription ID is required',
        'string.base': 'Subscription ID must be a string',
    }),
});
exports.subcriptionStatusValidation = joi_1.default.object({
    subscriptionId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    subscriptionStatus: joi_1.default.string().valid(enum_1.SUBCRIPTION_REQUEST.APPROVED, enum_1.SUBCRIPTION_REQUEST.REJECT),
});
exports.subcriptionStatusListValidation = joi_1.default.object({
    isSubscribed: joi_1.default.string().required(),
    pageCount: joi_1.default.number().required(),
    pageLimit: joi_1.default.number().required(),
});
exports.orderLocationValidation = joi_1.default.object({
    status: joi_1.default.string()
        .valid(enum_1.ADMIN_ORDER_LOCATIONS.ACCEPTED, enum_1.ADMIN_ORDER_LOCATIONS.ASSIGNED, enum_1.ADMIN_ORDER_LOCATIONS.ARRIVED, enum_1.ADMIN_ORDER_LOCATIONS.PICKED_UP, enum_1.ADMIN_ORDER_LOCATIONS.DEPARTED)
        .required(),
});
exports.deliveryManIdValidation = joi_1.default.object({
    deliveryManId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.orderWiseDeliveryManValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    pageCount: joi_1.default.number().required(),
    pageLimit: joi_1.default.number().required(),
});
exports.deliveryManWalletListValidation = joi_1.default.object({
    deliveryManId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    transactionType: joi_1.default.string()
        .valid(enum_1.TRANSACTION_TYPE.DEPOSIT, enum_1.TRANSACTION_TYPE.WITHDRAW)
        .required(),
    pageCount: joi_1.default.number().required(),
    pageLimit: joi_1.default.number().required(),
});
exports.userWalletListValidation = joi_1.default.object({
    transactionStatus: joi_1.default.string()
        .valid(enum_1.SUBCRIPTION_REQUEST.APPROVED, enum_1.SUBCRIPTION_REQUEST.PENDING, enum_1.SUBCRIPTION_REQUEST.REJECT)
        .required(),
    pageCount: joi_1.default.number().required(),
    pageLimit: joi_1.default.number().required(),
});
exports.deliveryManOrderListValidation = joi_1.default.object({
    deliveryManId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    pageCount: joi_1.default.number().required(),
    pageLimit: joi_1.default.number().required(),
    orderListType: joi_1.default.string()
        .valid(enum_1.ORDER_LIST.PENDING, enum_1.ORDER_LIST.COMPLETED)
        .required(),
});
exports.verificationStatusValidation = joi_1.default.object({
    deliveryManId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    documentId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    status: joi_1.default.string()
        .valid(enum_1.SUBCRIPTION_REQUEST.APPROVED, enum_1.SUBCRIPTION_REQUEST.REJECT)
        .required(),
});
