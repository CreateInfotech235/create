"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const enum_1 = require("../enum");
const signUp = {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', example: 'demo@gmail.com' },
    password: { type: 'string', example: 'demoDEMO@1121' },
    contactNumber: { type: 'number' },
    countryCode: { type: 'string' },
    otp: { type: 'number' },
};
const orderId = {
    orderId: { type: 'number', required: true },
};
const otp = {
    otp: { type: 'number', required: false },
};
const statusField = {
    status: { type: 'string', enum: Object.keys(enum_1.ORDER_REQUEST), required: true },
};
const acceptOrder = Object.assign({}, orderId);
const dayCharges = {
    cityId: { type: 'string' },
    productChargeId: { type: 'string' },
    fixedCharge: { type: 'number' },
    title: { type: 'string' },
    hours: { type: 'number' },
};
const swaggerOption = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Create Courier',
            description: `Backend software for create courier`,
            contact: {
                name: '',
                email: '',
                url: '',
            },
            servers: [`http://localhost:${process.env.PORT}`],
            version: '1.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    name: 'authorization',
                    bearerFormat: 'JWT',
                    description: ``,
                },
            },
            schemas: {
                UserWithdrawList: {
                    type: 'string',
                    enum: Object.keys(enum_1.SUBCRIPTION_REQUEST),
                },
                DeliveryManWalletList: {
                    type: 'string',
                    enum: Object.keys(enum_1.TRANSACTION_TYPE),
                },
                AdminCreateVehicle: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        capacity: { type: 'number' },
                        size: { type: 'number' },
                        description: { type: 'string' },
                        cityWise: { type: 'string', enum: enum_1.VEHICLE_CITY_TYPE },
                        city: { type: 'array', items: { type: 'string' } },
                        image: { type: 'string' },
                    },
                },
                AdminCreateDayCharges: {
                    type: 'object',
                    properties: dayCharges,
                },
                AdminUpdateDayCharges: {
                    type: 'object',
                    properties: Object.assign(Object.assign({}, dayCharges), { dayNumber: { type: 'number' } }),
                },
                AdminCreateExtraCharge: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        charge: { type: 'number' },
                        chargeType: { type: 'string', enum: enum_1.CHARGE_TYPE },
                        country: { type: 'string' },
                        city: { type: 'string' },
                        cashOnDelivery: { type: 'boolean' },
                    },
                },
                AdminDeleteVehicle: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', enum: enum_1.SWITCH, default: enum_1.SWITCH.DISABLE },
                    },
                },
                AdminCreateParcelType: {
                    type: 'object',
                    properties: {
                        label: { type: 'string' },
                    },
                },
                AdminCreateCountry: {
                    type: 'object',
                    properties: {
                        countryName: { type: 'string' },
                        distanceType: {
                            type: 'string',
                            enum: enum_1.DISTANCE_TYPE,
                            default: enum_1.DISTANCE_TYPE.MILES,
                        },
                        weightType: {
                            type: 'string',
                            enum: enum_1.WEIGHT_TYPE,
                            default: enum_1.WEIGHT_TYPE.POUND,
                        },
                    },
                },
                AdminCreateCity: {
                    type: 'object',
                    properties: {
                        cityName: { type: 'string' },
                        countryID: { type: 'string' },
                        fixedCharge: { type: 'number' },
                        cancelCharge: { type: 'number' },
                        minimumDistance: { type: 'number' },
                        minimumWeight: { type: 'number' },
                        perDistanceCharge: { type: 'number' },
                        perWeightCharge: { type: 'number' },
                        commissionType: {
                            type: 'string',
                            enum: enum_1.CHARGE_TYPE,
                            default: enum_1.CHARGE_TYPE.FIXED,
                        },
                        adminCommission: { type: 'number' },
                        pickupRequest: {
                            type: 'string',
                            enum: enum_1.PICKUP_REQUEST,
                            default: enum_1.PICKUP_REQUEST.REGULAR,
                        },
                    },
                },
                OrderCreateType: {
                    type: 'object',
                    properties: {
                        parcelType: { type: 'string' },
                        weight: { type: 'number' },
                        distance: { type: 'number' },
                        duration: { type: 'string' },
                        country: { type: 'string' },
                        city: { type: 'string' },
                        paymentCollection: {
                            type: 'string',
                            enum: enum_1.PAYMENT_TYPE,
                        },
                        paymentOrderLocation: {
                            type: 'string',
                            enum: enum_1.ORDER_LOCATION,
                        },
                        vehicle: { type: 'string' },
                        pickupDetails: {
                            type: 'object',
                            properties: {
                                location: {
                                    type: 'object',
                                    properties: {
                                        latitude: { type: 'number' },
                                        longitude: { type: 'number' },
                                    },
                                },
                                dateTime: { type: 'number' },
                                address: { type: 'string' },
                                countryCode: { type: 'string' },
                                mobileNumber: { type: 'number' },
                                email: { type: 'string' },
                                pickupRequest: {
                                    type: 'string',
                                    enum: enum_1.PICKUP_REQUEST,
                                },
                                description: { type: 'string' },
                                postCode: { type: 'string' },
                            },
                        },
                        deliveryDetails: {
                            type: 'object',
                            properties: {
                                location: {
                                    type: 'object',
                                    properties: {
                                        latitude: { type: 'number' },
                                        longitude: { type: 'number' },
                                    },
                                },
                                dateTime: { type: 'number' },
                                address: { type: 'string' },
                                countryCode: { type: 'string' },
                                mobileNumber: { type: 'number' },
                                email: { type: 'string' },
                                description: { type: 'string' },
                                postCode: { type: 'string' },
                            },
                        },
                        cashOnDelivery: { type: 'boolean' },
                        deliveryManId: { type: 'string' },
                    },
                },
                AdminOrderLocations: {
                    status: {
                        type: 'string',
                        enum: enum_1.ADMIN_ORDER_LOCATIONS,
                    },
                },
                OrderListType: {
                    type: 'string',
                    enum: Object.keys(enum_1.ORDER_STATUS),
                },
                OrderIdType: {
                    type: 'object',
                    properties: orderId,
                },
                OrderDeliveryAccept: {
                    type: 'object',
                    properties: Object.assign(Object.assign({}, acceptOrder), statusField),
                },
                OrderDelivery: {
                    type: 'object',
                    properties: acceptOrder,
                },
                OrderArriveType: {
                    type: 'object',
                    properties: Object.assign({}, acceptOrder),
                },
                OrderPickUpType: {
                    type: 'object',
                    properties: Object.assign(Object.assign(Object.assign({}, orderId), otp), { userSignature: { type: 'string', required: true }, pickupTimestamp: { type: 'string', required: true } }),
                },
                OrderDeliveryType: {
                    type: 'object',
                    properties: Object.assign(Object.assign(Object.assign({}, orderId), otp), { deliveryManSignature: { type: 'string', required: true }, deliverTimestamp: { type: 'string', required: true } }),
                },
                MobileSignUp: {
                    type: 'object',
                    properties: Object.assign(Object.assign({}, signUp), { medicalCertificateNumber: { type: 'number' } }),
                },
                DeliveryManSignUp: {
                    type: 'object',
                    properties: Object.assign(Object.assign({}, signUp), { documents: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    documentId: { type: 'string' },
                                    image: { type: 'string' },
                                    documentNumber: { type: 'number' },
                                },
                            },
                        } }),
                },
                DeliveryManUpdateLocation: {
                    type: 'object',
                    properties: {
                        // country: { type: 'string' },
                        // city: { type: 'string' },
                        location: {
                            type: 'object',
                            properties: {
                                latitude: { type: 'number' },
                                longitude: { type: 'number' },
                            },
                        },
                    },
                },
                MobileSignIn: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'demo@gmail.com' },
                        password: { type: 'string', example: 'demoDEMO@1121' },
                        personType: {
                            type: 'string',
                            enum: enum_1.PERSON_TYPE,
                            default: enum_1.PERSON_TYPE.CUSTOMER,
                        },
                    },
                },
                MobileOtpVerify: {
                    type: 'object',
                    properties: {
                        email: { type: 'string' },
                        contactNumber: { type: 'number' },
                        countryCode: { type: 'string' },
                        personType: {
                            type: 'string',
                            enum: enum_1.PERSON_TYPE,
                            default: enum_1.PERSON_TYPE.CUSTOMER,
                        },
                    },
                },
                MobileRenewToken: {
                    type: 'object',
                    properties: {
                        refreshToken: {
                            type: 'string',
                        },
                        personType: {
                            type: 'string',
                            enum: enum_1.PERSON_TYPE,
                            default: enum_1.PERSON_TYPE.CUSTOMER,
                        },
                    },
                },
                AdminAssignOrder: {
                    type: 'object',
                    properties: {
                        deliveryManId: { type: 'string' },
                        orderId: { type: 'number' },
                    },
                },
                AdminCreateDeliveryMan: {
                    type: 'object',
                    properties: {
                        deliveryManId: { type: 'string' },
                        documentId: { type: 'string' },
                        status: {
                            type: 'string',
                            enum: enum_1.SUBCRIPTION_REQUEST,
                            default: enum_1.SUBCRIPTION_REQUEST.APPROVED,
                        },
                    },
                },
                AdminCreateDocument: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        isRequired: { type: 'boolean' },
                    },
                },
                AdminManageSubscription: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        amount: { type: 'number' },
                        discount: { type: 'number' },
                        features: { type: 'array', items: { type: 'string' } },
                        days: { type: 'number' },
                        subscriptionId: { type: 'string' },
                    },
                },
                AdminAcceptSubscription: {
                    type: 'object',
                    properties: {
                        subscriptionId: { type: 'string' },
                        subscriptionStatus: {
                            type: 'string',
                            enum: [enum_1.SUBCRIPTION_REQUEST.APPROVED, enum_1.SUBCRIPTION_REQUEST.REJECT],
                            default: enum_1.SUBCRIPTION_REQUEST.APPROVED,
                        },
                    },
                },
                customerSignUpValidation: {
                    type: 'object',
                    properties: {
                        firstName: { type: 'string' },
                        merchantId: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string' },
                        address: { type: 'string' },
                        postCode: { type: 'string' },
                        mobileNumber: { type: 'string' },
                        country: { type: 'string' },
                        city: { type: 'string' },
                        location: {
                            type: 'object',
                            properties: {
                                latitude: { type: 'number' },
                                longitude: { type: 'number' },
                            },
                        },
                        createdByAdmin: { type: 'boolean' },
                        trashed: {
                            type: 'boolean',
                            default: false,
                        },
                    },
                    required: [
                        'firstName',
                        'merchantId',
                        'lastName',
                        'email',
                        'address',
                        'postCode',
                        'mobileNumber',
                        'country',
                        'city',
                    ],
                },
                customerUpdateValidation: {
                    type: 'object',
                    properties: {
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        country: { type: 'string' },
                        city: { type: 'string' },
                        address: { type: 'string' },
                        postCode: { type: 'string' },
                        mobileNumber: { type: 'string' },
                        email: { type: 'string' },
                        location: {
                            type: 'object',
                            properties: {
                                latitude: { type: 'number' },
                                longitude: { type: 'number' },
                            },
                        },
                        merchantId: { type: 'string' },
                        trashed: { type: 'boolean' },
                    },
                },
            },
        },
        // security: [
        //   {
        //     ApiKeyAuth: [],
        //   },
        // ],
    },
    apis: [
        './src/routes/admin/*.ts',
        './src/routes/deliveryBoy/*.ts',
        './src/routes/customer/*.ts',
        './src/routes/mobile/*.ts',
    ],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOption);
exports.default = swaggerDocs;
