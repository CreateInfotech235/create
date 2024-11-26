"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const CitySchema = new mongoose_1.default.Schema({
    cityName: { type: String, unique: true },
    countryID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'country' },
    commissionType: { type: String, enum: enum_1.CHARGE_TYPE },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('city', CitySchema, 'city');
exports.default = Model;
