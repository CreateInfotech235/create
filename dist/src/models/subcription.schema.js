"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubcriptionSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
    },
    amount: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    features: {
        type: Array,
    },
    seconds: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDesable: {
        type: Boolean,
        default: false,
    },
    poulartext: {
        type: String,
        default: '',
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('subcription', SubcriptionSchema);
exports.default = Model;
