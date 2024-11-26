"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CompanySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    mobileNumber: {
        type: Number,
    },
    countryCode: {
        type: String,
    },
    image: {
        type: String,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('company', CompanySchema, 'company');
exports.default = Model;
