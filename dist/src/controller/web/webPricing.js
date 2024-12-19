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
exports.updateWebPricing = exports.getWebPricing = exports.createWebPricing = void 0;
const webPricing_schema_1 = __importDefault(require("../../models/webPricing.schema"));
const createWebPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Create Web Pricing", req.body);
        const webPricing = yield webPricing_schema_1.default.create(req.body);
        res.status(200).json(webPricing);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createWebPricing = createWebPricing;
const getWebPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webPricing = yield webPricing_schema_1.default.findOne();
        res.status(200).json(webPricing);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getWebPricing = getWebPricing;
const updateWebPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webPricing = yield webPricing_schema_1.default.findOneAndUpdate({}, req.body, { new: true });
        res.status(200).json(webPricing);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateWebPricing = updateWebPricing;
