"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const VehicleSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    city: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId }],
    },
    size: {
        type: Number,
    },
    capacity: {
        type: Number,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    cityType: {
        type: String,
        default: enum_1.VEHICLE_CITY_TYPE.ALL,
        enum: enum_1.VEHICLE_CITY_TYPE,
    },
    status: {
        type: String,
        default: enum_1.SWITCH.ENABLE,
        enum: enum_1.SWITCH,
    },
    // customer: { type: mongoose.Schema.Types.ObjectId },
    merchant: { type: mongoose_1.default.Schema.Types.ObjectId },
    isCustomer: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('vehicle', VehicleSchema);
exports.default = Model;
