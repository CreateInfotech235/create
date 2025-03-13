"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const merchantSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    countryCode: {
        type: String,
    },
    merchantUserId: {
        type: String,
    },
    // country: {
    //   type: String,
    //   unique: true,
    // },
    // city: {
    //   type: String,
    //   unique: true,
    // },
    status: {
        type: String,
        default: enum_1.SWITCH.ENABLE,
        enum: enum_1.SWITCH,
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    showOrderNumber: {
        type: Number,
        default: 1,
    },
    showCustomerNumber: {
        type: Number,
        default: 1,
    },
    showDeliveryManNumber: {
        type: Number,
        default: 1,
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
    medicalCertificateNumber: {
        type: Number,
        unique: true,
    },
    medicalCertificate: {
        type: String,
    },
    language: {
        type: String,
        default: 'en',
    },
    image: {
        type: String,
    },
    freeSubscription: {
        type: Boolean,
        default: false,
    },
    address: {
        street: String,
        city: String,
        // state: String,
        postalCode: String,
        country: String,
    },
    isApproved: { type: String, default: enum_1.isApprovedStatus.PENDING },
    reason: { type: String, default: '' },
    isApprovedfasttime: { type: Boolean, default: true },
    createdByAdmin: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
// const Model = mongoose.model('user', userSchema);
const Model = mongoose_1.default.model('merchant', merchantSchema);
exports.default = Model;
