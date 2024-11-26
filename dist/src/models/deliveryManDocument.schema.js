"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const DeliveryManDocumentSchema = new mongoose_1.default.Schema({
    document: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'documents' },
    deliveryManId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'deliveryMan' },
    documentNumber: { type: String },
    status: {
        type: String,
        enum: enum_1.SUBCRIPTION_REQUEST,
        default: enum_1.SUBCRIPTION_REQUEST.PENDING,
    },
    image: { type: String },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('deliveryManDocuments', DeliveryManDocumentSchema, 'deliveryManDocuments');
exports.default = Model;
