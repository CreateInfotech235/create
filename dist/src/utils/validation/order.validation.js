"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderAdminListValidation = exports.invoiceValidation = exports.orderCancelMultiValidation = exports.orderCancelValidation = exports.orderIdValidationForDelivery = exports.orderIdValidation = exports.orderDeliverValidationMulti = exports.orderDeliverValidation = exports.orderPickUpValidation = exports.orderListByDeliveryManValidation = exports.orderArriveValidationMulti = exports.orderArriveValidation = exports.orderAcceptValidation = exports.orderAssignValidation = exports.newOrderUpdateMulti = exports.newOrderCreationMulti = exports.newOrderCreation = exports.orderCreateValidation = void 0;
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
    // parcelsCount: Joi.number().required(),
    dateTime: joi_1.default.date().timestamp().required(),
    // paymentCollection: Joi.string(),
    // paymentCollectionRupees: Joi.number(),
    // description: Joi.string(),
    pickupDetails: joi_1.default.object({
        location: joi_1.default.object({
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
        }).required(),
        dateTime: joi_1.default.date().timestamp().required(),
        address: joi_1.default.string().required(),
        merchantId: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        // countryCode: Joi.string().required(),
        mobileNumber: joi_1.default.string().required(),
        email: joi_1.default.string(),
        pickupRequest: joi_1.default.string()
            .valid(enum_1.PICKUP_REQUEST.REGULAR, enum_1.PICKUP_REQUEST.EXPRESS)
            .default(enum_1.PICKUP_REQUEST.REGULAR),
        description: joi_1.default.string().allow(''),
        postCode: joi_1.default.string()
            .regex(/^[A-Za-z0-9\s-]+$/)
            .required(),
    }),
    deliveryDetails: joi_1.default.object({
        location: joi_1.default.object({
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
        }).required(),
        dateTime: joi_1.default.date().timestamp(),
        address: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        // countryCode: Joi.string().required(),
        mobileNumber: joi_1.default.string().required(),
        email: joi_1.default.string(),
        description: joi_1.default.string().allow(''),
        postCode: joi_1.default.string()
            .regex(/^[A-Za-z0-9\s-]+$/)
            .required(),
        cashCollection: joi_1.default.number(),
    }),
    cashOnDelivery: joi_1.default.boolean().default(false),
    trashed: joi_1.default.boolean().default(false),
    duration: joi_1.default.string().required(),
    distance: joi_1.default.number().required(),
    deliveryManId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .allow('')
        .default(''),
});
exports.newOrderCreationMulti = joi_1.default.object({
    dateTime: joi_1.default.date().timestamp().required(),
    pickupDetails: joi_1.default.object({
        address: joi_1.default.string().required(),
        dateTime: joi_1.default.date().timestamp().required(),
        description: joi_1.default.string().allow(''),
        email: joi_1.default.string().email().required(),
        location: joi_1.default.object({
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
        }).required(),
        merchantId: joi_1.default.string().required(),
        mobileNumber: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        postCode: joi_1.default.string()
            .regex(/^[A-Za-z0-9\s-]+$/)
            .required(),
    }).required(),
    deliveryManId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    merchant: joi_1.default.string().required(),
    deliveryDetails: joi_1.default.array()
        .items(joi_1.default.object({
        customerId: joi_1.default.string().required(),
        subOrderId: joi_1.default.number().required(),
        address: joi_1.default.string().required(),
        email: joi_1.default.string().allow('').allow('-'),
        location: joi_1.default.object({
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
        }).required(),
        mobileNumber: joi_1.default.string().allow('').allow('-'),
        name: joi_1.default.string().allow('').allow('-'),
        postCode: joi_1.default.string()
            .regex(/^[A-Za-z0-9\s-]+$/)
            .required(),
        distance: joi_1.default.number().allow(''),
        duration: joi_1.default.string().allow(''),
        description: joi_1.default.string().allow('').allow('-'),
        parcelsCount: joi_1.default.number().required(),
        paymentCollectionRupees: joi_1.default.number().required(),
        cashOnDelivery: joi_1.default.boolean().valid(true, false).required(),
        parcelType: joi_1.default.string().allow(''),
        parcelType2: joi_1.default.array().items(joi_1.default.string()).allow(null).default([]),
    }))
        .required(),
});
exports.newOrderUpdateMulti = joi_1.default.object({
    dateTime: joi_1.default.date().timestamp().required(),
    pickupDetails: joi_1.default.object({
        address: joi_1.default.string().required(),
        dateTime: joi_1.default.date().timestamp().required(),
        description: joi_1.default.string().allow(''),
        email: joi_1.default.string().email().required(),
        location: joi_1.default.object({
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
        }).required(),
        merchantId: joi_1.default.string().required(),
        mobileNumber: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        postCode: joi_1.default.string()
            .regex(/^[A-Za-z0-9\s-]+$/)
            .required(),
    }).required(),
    deliveryManId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    merchant: joi_1.default.string().required(),
    deliveryDetails: joi_1.default.array()
        .items(joi_1.default.object({
        customerId: joi_1.default.string().required(),
        status: joi_1.default.string().valid(enum_1.ORDER_HISTORY.CREATED, enum_1.ORDER_HISTORY.ASSIGNED, enum_1.ORDER_HISTORY.ACCEPTED, enum_1.ORDER_HISTORY.ARRIVED, enum_1.ORDER_HISTORY.PICKED_UP, enum_1.ORDER_HISTORY.DELIVERED, enum_1.ORDER_HISTORY.DEPARTED, enum_1.ORDER_HISTORY.CANCELLED).required(),
        subOrderId: joi_1.default.number().required(),
        address: joi_1.default.string().required(),
        email: joi_1.default.string().allow('').allow('-'),
        location: joi_1.default.object({
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
        }).required(),
        mobileNumber: joi_1.default.string().allow('').allow('-'),
        name: joi_1.default.string().allow('').allow('-'),
        postCode: joi_1.default.string()
            .regex(/^[A-Za-z0-9\s-]+$/)
            .required(),
        distance: joi_1.default.number().allow(''),
        duration: joi_1.default.string().allow(''),
        description: joi_1.default.string().allow('').allow('-'),
        parcelsCount: joi_1.default.number().required(),
        paymentCollectionRupees: joi_1.default.number().required(),
        cashOnDelivery: joi_1.default.boolean().valid(true, false).required(),
        parcelType: joi_1.default.string().allow(''),
        parcelType2: joi_1.default.array().items(joi_1.default.string()).allow(null).default([]),
    }))
        .required(),
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
exports.orderArriveValidationMulti = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    subOrderId: joi_1.default.number().optional(),
});
exports.orderListByDeliveryManValidation = joi_1.default.object({
    startDate: joi_1.default.string().allow(''),
    endDate: joi_1.default.string().allow(''),
    status: joi_1.default.string()
        .valid(enum_1.ORDER_HISTORY.CREATED, enum_1.ORDER_HISTORY.ASSIGNED, enum_1.ORDER_HISTORY.ACCEPTED, enum_1.ORDER_HISTORY.ARRIVED, enum_1.ORDER_HISTORY.PICKED_UP, enum_1.ORDER_HISTORY.DELIVERED, enum_1.ORDER_HISTORY.DEPARTED, enum_1.ORDER_HISTORY.CANCELLED)
        .allow(''),
    pageCount: joi_1.default.number(),
    pageLimit: joi_1.default.number(),
});
exports.orderPickUpValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    subOrderId: joi_1.default.array().required(),
    userSignature: joi_1.default.string()
        .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
        .required(),
    pickupTimestamp: joi_1.default.date().timestamp().required(),
    // otp: Joi.number(),
});
exports.orderDeliverValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    deliveryManSignature: joi_1.default.string()
        .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
        .required(),
    deliverTimestamp: joi_1.default.date().timestamp().required(),
    // otp: Joi.number(),
});
exports.orderDeliverValidationMulti = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    subOrderId: joi_1.default.number().required(),
    deliveryManSignature: joi_1.default.string()
        .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
        .required(),
    deliverTimestamp: joi_1.default.date().timestamp().required(),
    // otp: Joi.number(),
});
exports.orderIdValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
});
exports.orderIdValidationForDelivery = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    subOrderId: joi_1.default.number().required(),
});
exports.orderCancelValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    reason: joi_1.default.string(),
    // subOrderId : Joi.number().required(),
});
exports.orderCancelMultiValidation = joi_1.default.object({
    orderId: joi_1.default.number().required(),
    reason: joi_1.default.string().required(),
    subOrderId: joi_1.default.array().required(),
});
exports.invoiceValidation = joi_1.default.object({
    companyName: joi_1.default.string().required(),
    city: joi_1.default.string(),
    address: joi_1.default.string().required(),
    logo: joi_1.default.string(),
    header: joi_1.default.string(),
    footer: joi_1.default.string(),
    merchantId: joi_1.default.string().required(),
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
