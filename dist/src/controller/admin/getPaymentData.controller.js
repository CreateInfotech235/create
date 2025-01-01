"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentTotal = exports.getPaymentData = void 0;
const languageHelper_1 = require("../../language/languageHelper");
const paymentGet_schema_1 = __importDefault(require("../../models/paymentGet.schema"));
const getPaymentData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentData = yield paymentGet_schema_1.default
            .find({})
            .populate('merchantId', 'name email contactNumber')
            .populate('deliveryManId', 'firstName lastName email contactNumber');
        console.log(paymentData, 'paymentData');
        return res.ok({ data: paymentData });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getPaymentData = getPaymentData;
const getPaymentTotal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield paymentGet_schema_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalPaytoAdmin: { $sum: "$totalPaytoAdmin" },
                },
            },
        ]);
        return res.ok({
            data: result[0],
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getPaymentTotal = getPaymentTotal;
