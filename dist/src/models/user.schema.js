"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const merchantSchema = new mongoose_1.default.Schema({
    name: {
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
        type: Number,
    },
    countryCode: {
        type: String,
    },
    country: {
        type: String,
        unique: true,
    },
    city: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        default: enum_1.SWITCH.ENABLE,
        enum: enum_1.SWITCH,
    },
    isVerified: {
        type: Boolean,
        default: true,
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
    address: {
        street: String,
        city: String,
        // state: String,
        postalCode: String,
        country: String,
    },
    createdByAdmin: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
// const Model = mongoose.model('user', userSchema);
const Model = mongoose_1.default.model('merchant', merchantSchema);
exports.default = Model;
