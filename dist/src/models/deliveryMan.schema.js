"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const DeliveryManSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    countryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    cityId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    address: {
        type: String,
    },
    postCode: {
        type: String,
    },
    status: {
        type: String,
        enum: enum_1.SWITCH,
        default: enum_1.SWITCH.ENABLE,
    },
    location: {
        type: {
            type: String,
        },
        coordinates: [],
    },
    defaultLocation: {
        type: {
            type: String,
        },
        coordinates: [],
    },
    bankData: {
        type: {
            name: { type: String },
            accountNumber: { type: Number },
            permanentBankName: { type: String },
            ifscCode: { type: String },
        },
    },
    balance: {
        type: Number,
        default: 0,
    },
    earning: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
    },
    provider: {
        type: String,
        enum: enum_1.PROVIDER,
        default: enum_1.PROVIDER.APP,
    },
    providerId: {
        type: String,
        enum: enum_1.PROVIDER,
    },
    merchant: {
        type: mongoose_1.default.Types.ObjectId,
    },
    isCustomer: {
        type: Boolean,
        default: false,
    },
    trashed: { type: Boolean, default: false },
    language: {
        type: String,
        default: 'en',
    },
    // merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // Associating with Merchant
    merchantId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'merchant' }, // Associating with Merchant
    createdByMerchant: { type: Boolean, default: false },
    createdByAdmin: { type: Boolean, default: false },
    emergencyContact: {
        type: {
            name: { type: String },
            number: { type: Number },
        },
    },
    showDeliveryManNumber: {
        type: Number,
        required: false,
    },
    // charge method delivery boy
    chargeMethod: {
        type: String,
        enum: enum_1.CHARGE_METHOD,
        default: enum_1.CHARGE_METHOD.TIME,
    },
    // charge method delivery boy
    charge: {
        type: Number,
        default: 10,
    },
    // admin charge method
    adminCharge: {
        type: Number,
        default: 0,
    },
    deviceToken: {
        type: String,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('deliveryMan', DeliveryManSchema, 'deliveryMan');
exports.default = Model;
