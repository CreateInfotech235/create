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
exports.deleteInvoice = exports.updateInvoice = exports.getInvoice = exports.createInvoice = void 0;
const invoice_schema_1 = __importDefault(require("../../models/invoice.schema"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const languageHelper_1 = require("../../language/languageHelper");
const order_validation_1 = require("../../utils/validation/order.validation");
const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.invoiceValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // Check if invoice already exists for merchant
        const existingInvoice = yield invoice_schema_1.default.findOne({
            merchantId: value.merchantId,
        });
        if (existingInvoice) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invoiceAlreadyExists,
            });
        }
        const invoice = yield invoice_schema_1.default.create(value);
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').invoiceCreatedSuccessfully,
            data: invoice,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createInvoice = createInvoice;
const getInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { merchantId } = req.params;
        const invoice = yield invoice_schema_1.default.findOne({ merchantId });
        if (!invoice) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invoiceNotFound });
        }
        return res.ok({
            data: invoice,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getInvoice = getInvoice;
const updateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { merchantId } = req.params;
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.invoiceValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const invoice = yield invoice_schema_1.default.findOneAndUpdate({ merchantId }, value, {
            new: true,
        });
        if (!invoice) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invoiceNotFound });
        }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').invoiceUpdatedSuccessfully,
            data: invoice,
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateInvoice = updateInvoice;
const deleteInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { merchantId } = req.params;
        const invoice = yield invoice_schema_1.default.findOneAndDelete({ merchantId });
        if (!invoice) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invoiceNotFound });
        }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').invoiceDeletedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteInvoice = deleteInvoice;
