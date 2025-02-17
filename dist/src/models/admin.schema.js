"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminSchema = new mongoose_1.default.Schema({
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
    profileImage: {
        type: String,
    },
    balance: {
        type: Number,
    },
    language: {
        type: String,
        default: 'en',
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
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('admin', AdminSchema);
exports.default = Model;
