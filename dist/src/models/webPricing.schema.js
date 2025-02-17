"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Part1Schema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    bgImage: {
        type: String,
    },
});
const Part2Schema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    subTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    subImage: {
        type: String,
    },
});
const WebPricingSchema = new mongoose_1.default.Schema({
    Part1: [Part1Schema],
    Part2: [Part2Schema],
});
exports.default = mongoose_1.default.model('WebPricing', WebPricingSchema);
