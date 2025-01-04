"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MapApi = new mongoose_1.default.Schema({
    mapKey: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
});
const Model = mongoose_1.default.model('MapApi', MapApi, 'MapApi');
exports.default = Model;
