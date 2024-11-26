"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const CountrySchema = new mongoose_1.default.Schema({
    countryName: {
        type: String,
        unique: true,
    },
    distanceType: {
        type: String,
        enum: enum_1.DISTANCE_TYPE,
    },
    weightType: {
        type: String,
        enum: enum_1.WEIGHT_TYPE,
    },
    // country: {
    //   type: String,
    //   unique: true,
    // },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('country', CountrySchema, 'country');
exports.default = Model;
