"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// bile of delivery boy payment
const HomeLandingpageSchema = new mongoose_1.default.Schema({
    AutoTyperlist: [{ type: String }],
    subTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    bgImage: {
        type: String,
    }
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('homeLandingpage', HomeLandingpageSchema, 'homeLandingpage');
exports.default = Model;
