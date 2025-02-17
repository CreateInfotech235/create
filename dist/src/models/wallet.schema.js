"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const WalletSchema = new mongoose_1.default.Schema({
    personId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    type: {
        type: String,
        enum: enum_1.TRANSACTION_TYPE,
    },
    message: {
        type: String,
    },
    userFlag: {
        type: String,
        enum: enum_1.PERSON_TYPE,
    },
    availableBalance: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    status: {
        type: String,
        enum: enum_1.SUBCRIPTION_REQUEST,
        default: enum_1.SUBCRIPTION_REQUEST.APPROVED,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('walletHistory', WalletSchema, 'walletHistory');
exports.default = Model;
