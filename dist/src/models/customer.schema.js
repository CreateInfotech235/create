"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CounterSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    seq: { type: Number, default: 0 },
}, { timestamps: true });
const Counter = mongoose_1.default.model('Counter', CounterSchema);
// Customer schema definition
const CustomerSchema = new mongoose_1.Schema({
    customerId: { type: String, unique: true }, // Add the customerId field
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
    country: { type: String, required: true },
    // city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    city: { type: String, required: true },
    showCustomerNumber: {
        type: Number,
        required: false,
    },
    address: {
        type: String,
        required: true,
    },
    merchantId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'merchant',
    },
    postCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    trashed: { type: Boolean, default: false },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true },
    },
    createdByAdmin: { type: Boolean, default: false },
    NHS_Number: {
        type: String,
        required: false,
    },
}, { timestamps: true });
// Function to get the next sequence value
const getNextSequenceValue = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const sequenceDocument = yield Counter.findOneAndUpdate({ name: name }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return sequenceDocument.seq;
});
// Pre-save hook to generate a sequential customerId
CustomerSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew) {
            const nextSeq = yield getNextSequenceValue('customerId');
            this.customerId = `${nextSeq}`; // You can change the prefix as needed
        }
        next();
    });
});
const Model = mongoose_1.default.model('Customer', CustomerSchema, 'customer');
exports.default = Model;
