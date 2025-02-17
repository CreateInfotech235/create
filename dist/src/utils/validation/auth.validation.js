"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateFreeSubcriptionValidation = exports.renewTokenValidation = exports.otpVerifyValidation = exports.adminProfileValidation = exports.adminCredentialValidation = exports.customerSignUpValidationmul = exports.customerSignUpValidation = exports.customerUpdateValidation = exports.updatePasswordValidation = exports.deliveryManSignUpValidation = exports.userSignUpValidation = exports.sendOtpValidation = exports.resetPasswordValidation = exports.verifyOtpValidation = exports.userSignInValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../../enum");
exports.userSignInValidation = joi_1.default.object().keys({
    email: joi_1.default.string()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .required(),
    password: joi_1.default.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .required(),
    personType: joi_1.default.string()
        .valid(enum_1.PERSON_TYPE.CUSTOMER, enum_1.PERSON_TYPE.DELIVERY_BOY)
        .required(),
    deviceToken: joi_1.default.string().optional(),
});
exports.verifyOtpValidation = joi_1.default.object().keys({
    otp: joi_1.default.number().required(),
    email: joi_1.default.string().required(),
});
exports.resetPasswordValidation = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    newPassword: joi_1.default.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .required(),
});
exports.sendOtpValidation = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
});
exports.userSignUpValidation = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .required(),
    password: joi_1.default.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .required(),
    contactNumber: joi_1.default.number().required(),
    countryCode: joi_1.default.string().required(),
    // otp: Joi.number().required(),
    otp: joi_1.default.when(joi_1.default.alternatives().try(joi_1.default.exist().valid(true).label('createdByAdmin')), {
        then: joi_1.default.optional(),
        otherwise: joi_1.default.number().required(),
    }),
    image: joi_1.default.string()
        .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
        .optional(),
    medicalCertificateNumber: joi_1.default.number().optional(),
    medicalCertificate: joi_1.default.string()
        .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
        .optional(),
    address: joi_1.default.object()
        .keys({
        street: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        // state: Joi.string().required(),
        postalCode: joi_1.default.string()
            // .regex(/^\d{5}(-\d{4})?$/)
            .required(), // US postal code example (adjust for other formats)
        country: joi_1.default.string().required(),
    })
        .required(),
    freeSubscription: joi_1.default.boolean().default(false),
    createdByAdmin: joi_1.default.boolean().optional(),
});
exports.deliveryManSignUpValidation = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    trashed: joi_1.default.boolean().default(false),
    email: joi_1.default.string()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .required(),
    password: joi_1.default.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .required(),
    contactNumber: joi_1.default.string().required(),
    // countryCode: Joi.string().required(),
    address: joi_1.default.string(),
    postCode: joi_1.default.string()
        .regex(/^[A-Za-z0-9\s-]+$/)
        .required(),
    chargeMethod: joi_1.default.string()
        .valid(enum_1.CHARGE_METHOD.DISTANCE, enum_1.CHARGE_METHOD.TIME)
        .required(),
    charge: joi_1.default.number().required(),
    otp: joi_1.default.when(joi_1.default.alternatives().try(joi_1.default.exist().valid(true).label('createdByAdmin'), joi_1.default.exist().label('merchantId')), {
        then: joi_1.default.optional(),
        otherwise: joi_1.default.number().required(),
    }),
    medicalCertificateNumber: joi_1.default.string().optional(),
    documents: joi_1.default.array()
        .items(joi_1.default.object({
        documentId: joi_1.default.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        image: joi_1.default.string().regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i),
        documentNumber: joi_1.default.string().required(),
    }))
        .optional(),
    image: joi_1.default.string()
        .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
        .optional(),
    merchantId: joi_1.default.string().optional(),
    createdByAdmin: joi_1.default.boolean().optional(),
    location: joi_1.default.object({
        latitude: joi_1.default.number().required(),
        longitude: joi_1.default.number().required(),
    }).required(),
    defaultLocation: joi_1.default.object({
        latitude: joi_1.default.number().required(),
        longitude: joi_1.default.number().required(),
    }).required(),
});
exports.updatePasswordValidation = joi_1.default.object().keys({
    firstName: joi_1.default.string().optional(),
    lastName: joi_1.default.string().optional(),
    email: joi_1.default.string()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .optional(),
    contactNumber: joi_1.default.number().optional(),
    // countryCode: Joi.string().required(),
    address: joi_1.default.string().optional(),
    postCode: joi_1.default.string()
        .regex(/^[A-Za-z0-9\s-]+$/)
        .optional(),
    chargeMethod: joi_1.default.string()
        .valid(enum_1.CHARGE_METHOD.DISTANCE, enum_1.CHARGE_METHOD.TIME)
        .optional(),
    charge: joi_1.default.number().optional(),
    oldPassword: joi_1.default.string().min(8).required(),
    newPassword: joi_1.default.string().min(8).required(),
    confirmPassword: joi_1.default.string().min(8).required(),
});
exports.customerUpdateValidation = joi_1.default.object({
    firstName: joi_1.default.string().optional(),
    lastName: joi_1.default.string().optional(),
    country: joi_1.default.string().optional(),
    city: joi_1.default.string().optional(),
    address: joi_1.default.string().optional(),
    postCode: joi_1.default.string().optional(),
    mobileNumber: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    location: joi_1.default.object({
        latitude: joi_1.default.number().required(),
        longitude: joi_1.default.number().required(),
    }).optional(),
    merchantId: joi_1.default.string().optional(),
    trashed: joi_1.default.boolean().optional(),
    NHS_Number: joi_1.default.string().optional(),
});
exports.customerSignUpValidation = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    merchantId: joi_1.default.string(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string()
        // .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .allow(''),
    address: joi_1.default.string().required(),
    postCode: joi_1.default.string().required(),
    mobileNumber: joi_1.default.string().allow(''),
    country: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    location: joi_1.default.object({
        latitude: joi_1.default.number(),
        longitude: joi_1.default.number(),
    }),
    Patient_ID: joi_1.default.string(),
    createdByAdmin: joi_1.default.boolean().optional(),
    trashed: joi_1.default.boolean().default(false),
    NHS_Number: joi_1.default.string().allow(''),
});
exports.customerSignUpValidationmul = joi_1.default.object().keys({
    firstName: joi_1.default.string().allow('-').required(),
    merchantId: joi_1.default.string(),
    lastName: joi_1.default.string().allow('-').required(),
    email: joi_1.default.string().allow('-').optional(),
    // .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    address: joi_1.default.string().allow('-').required(),
    postCode: joi_1.default.string().allow('-').required(),
    mobileNumber: joi_1.default.string().allow('-').required(),
    country: joi_1.default.string().allow('-').required(),
    city: joi_1.default.string().allow('-').required(),
    location: joi_1.default.object({
        latitude: joi_1.default.number().allow('-'),
        longitude: joi_1.default.number().allow('-'),
    }),
    NHS_Number: joi_1.default.string().required(),
    createdByAdmin: joi_1.default.boolean().optional(),
    trashed: joi_1.default.boolean().default(false),
});
exports.adminCredentialValidation = joi_1.default.object().keys({
    adminId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    email: joi_1.default.string()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .required(),
    contactNumber: joi_1.default.number().required(),
    countryCode: joi_1.default.string().required(),
    otp: joi_1.default.number().required(),
});
exports.adminProfileValidation = joi_1.default.object().keys({
    adminId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    name: joi_1.default.string().required(),
    profileImage: joi_1.default.string()
        .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
        .required(),
});
exports.otpVerifyValidation = joi_1.default.object().keys({
    email: joi_1.default.string()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .required(),
    contactNumber: joi_1.default.number().required(),
    // countryCode: Joi.string().required(),
    messageSend: joi_1.default.string().optional(),
    subject: joi_1.default.string().optional(),
    personType: joi_1.default.string()
        .valid(enum_1.PERSON_TYPE.CUSTOMER, enum_1.PERSON_TYPE.DELIVERY_BOY, enum_1.PERSON_TYPE.ADMIN)
        .required(),
});
exports.renewTokenValidation = joi_1.default.object().keys({
    refreshToken: joi_1.default.string().required(),
    personType: joi_1.default.string()
        .valid(enum_1.PERSON_TYPE.CUSTOMER, enum_1.PERSON_TYPE.DELIVERY_BOY, enum_1.PERSON_TYPE.ADMIN)
        .required(),
});
exports.activateFreeSubcriptionValidation = joi_1.default.object().keys({
    userId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    medicalCertificateNumber: joi_1.default.number().required(),
    medicalCertificate: joi_1.default.string()
        .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
        .required(),
});
