"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const CommissionSchema = new mongoose_1.default.Schema({
    admin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    personId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    amount: {
        type: Number,
    },
    userFlag: {
        type: String,
        enum: enum_1.PERSON_TYPE,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('adminCommission', CommissionSchema, 'adminCommission');
exports.default = Model;
