"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderAdminListValidation = exports.orderCancelValidation = exports.orderIdValidation = exports.orderDeliverValidation = exports.orderPickUpValidation = exports.orderListByDeliveryManValidation = exports.orderArriveValidation = exports.orderAcceptValidation = exports.orderAssignValidation = exports.newOrderCreation = exports.orderCreateValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../../enum");
exports.orderCreateValidation = joi_1.default.object({
    parcelType: joi_1.default.string().required(),
    weight: joi_1.default.number().required(),
    distance: joi_1.default.number(),
    country: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    parcelsCount: joi_1.default.number().required(),
    startPickupDate: joi_1.default.date().timestamp(),
    endPickupDate: joi_1.default.date().timestamp(),
    startDeliveryDate: joi_1.default.date().timestamp(),
    endDeliveryDate: joi_1.default.date().timestamp(),
    pickupDetails: joi_1.default.object({
        location: joi_1.default.object({
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
        }).required(),
        dateTime: joi_1.default.date().timestamp().required(),
        address: joi_1.default.string().required(),
        countryCode: joi_1.default.string().required(),
        mobileNumber: joi_1.default.number().required(),
        email: joi_1.default.string(),
        pickupRequest: joi_1.default.string()
            .valid(enum_1.PICKUP_REQUEST.REGULAR, enum_1.PICKUP_REQUEST.EXPRESS)
            .default(enum_1.PICKUP_REQUEST.REGULAR),
        description: joi_1.default.string(),
        postCode: joi_1.default.string()
            .regex(/^[A-Za-z0-9\s-]+$/)
            .required(),
    }),
    deliveryDetails: joi_1.default.object({
        location: joi_1.default.object({
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
        }).required(),
        dateTime: joi_1.default.date().timestamp().required(),
        address: joi_1.default.string().required(),
        countryCode: joi_1.default.string().required(),
        mobileNumber: joi_1.default.number().required(),
        email: joi_1.default.string(),
        description: joi_1.default.string(),
        postCode: joi_1.default.string()
            .regex(/^[A-Za-z0-9\s-]+$/)
            .required(),
        cashCollection: joi_1.default.number(),
    }),
    paymentCollection: joi_1.default.string(),
    paymentOrderLocation: joi_1.default.string().valid(enum_1.ORDER_LOCATION.PICK_UP, enum_1.ORDER_LOCATION.DELIVERY),
    cashOnDelivery: joi_1.default.boolean().default(false),
    vehicle: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    duration: joi_1.default.string().required(),
    // deliveryManId: Joi.string()
    //   .valid(/^[0-9a-fA-F]{24}$/)
    //   .default(''),
    deliveryManId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .allow('')
        .default(''),
});
exports.newOrderCreation = joi_1.default.object({
    parcelsCount: joi_1.default.number().required(),
    dateTime: joi_1.default.date().timestamp().required(),
    paymentCollection: joi_1.default.string(),
    paymentCollectionRupees: joi_1.default.number(),
    description: joi_1.default.string(),
    pickupDetails: joi_1.default.object({
        // location: Joi.object({
        //   latitude: Joi.number().required(),
        //   longitude: Joi.number().required(),
        // }).required(),
        dateTime: joi_1.default.date().timestamp().required(),
        address: joi_1.default.string().required(),
        merchantId: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        // countryCode: Joi.string().required(),
        mobileNumber: joi_1.default.number().required(),
        email: joi_1.default.string(),
        pickupRequest: joi_1.default.string()
            .valid(enum_1.PICKUP_REQUEST.REGULAR, enum_1.PICKUP_REQUEST.EXPRESS)
            .default(enum_1.PICKUP_REQUEST.REGULAR),
        description: joi_1.default.string(),
        postCode: joi_1.default.string()
            .regex(/^[A-Za-z0-9\s-]+$/)
            .required(),
    }),
    deliveryDetails: joi_1.default.object({
        // location: Joi.object({
        //   latitude: Joi.number().required(),
        //   longitude: Joi.number().required(),
        // }).required(),
        dateTime: joi_1.default.date().timestamp(),
        address: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        // countryCode: Joi.string().required(),
        mobileNumber: joi_1.default.number().required(),
        email: joi_1.default.string(),
        description: joi_1.default.string().allow(''),
        postCode: joi_1.default.string()
            .regex(/^[A-Za-z0-9\s-]+$/)
            .required(),
        cashCollection: joi_1.default.number(),
    }),
    cashOnDelivery: joi_1.default.boolean().default(false),
    trashed: joi_1.default.boolean().default(false),
    deliveryManId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .allow('')
        .default(''),
});
exports.orderAssignValidation = joi_1.default.object({
    deliveryManId: joi_1.default.string()
        // .valid(/^[0-9a-fA-F]{24}$/)
        .required(),
    orderId: joi_1.default.number().required(),
});
exports.orderAcceptValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    status: joi_1.default.string()
        .valid(enum_1.ORDER_REQUEST.ACCEPTED, enum_1.ORDER_REQUEST.REJECT)
        .required(),
});
exports.orderArriveValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
});
exports.orderListByDeliveryManValidation = joi_1.default.object({
    startDate: joi_1.default.string(),
    endDate: joi_1.default.string(),
    status: joi_1.default.string()
        .valid(enum_1.ORDER_HISTORY.CREATED, enum_1.ORDER_HISTORY.ASSIGNED, enum_1.ORDER_HISTORY.ACCEPTED, enum_1.ORDER_HISTORY.ARRIVED, enum_1.ORDER_HISTORY.PICKED_UP, enum_1.ORDER_HISTORY.DELIVERED, enum_1.ORDER_HISTORY.DEPARTED, enum_1.ORDER_HISTORY.CANCELLED)
        .allow(''),
    pageCount: joi_1.default.number().required(),
    pageLimit: joi_1.default.number().required(),
});
exports.orderPickUpValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    userSignature: joi_1.default.string()
        .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
        .required(),
    pickupTimestamp: joi_1.default.date().timestamp().required(),
    otp: joi_1.default.number(),
});
exports.orderDeliverValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    deliveryManSignature: joi_1.default.string()
        .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
        .required(),
    deliverTimestamp: joi_1.default.date().timestamp().required(),
    otp: joi_1.default.number(),
});
exports.orderIdValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
});
exports.orderCancelValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    reason: joi_1.default.string(),
});
exports.orderAdminListValidation = joi_1.default.object({
    date: joi_1.default.string(),
    status: joi_1.default.string().valid(...Object.keys(enum_1.ORDER_HISTORY)),
    user: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
    deliveryMan: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
    orderId: joi_1.default.number(),
    invoiceId: joi_1.default.number(),
    pageCount: joi_1.default.number().default(1),
    pageLimit: joi_1.default.number().default(10),
});
