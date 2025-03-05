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
exports.getWebFooter = exports.createWebFooter = void 0;
const webFooter_1 = __importDefault(require("../../models/webFooter"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const web_validation_1 = require("../../utils/validation/web.validation");
const createWebFooter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, web_validation_1.FooterpageValidation);
        console.log('validateRequest', validateRequest);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const isalreadycreated = yield webFooter_1.default.findOne();
        console.log(isalreadycreated);
        if (isalreadycreated) {
            const webFooter = yield webFooter_1.default.findOneAndUpdate({}, validateRequest.value, { new: true });
            console.log(webFooter);
            return res.status(200).json({
                status: 200,
                message: 'Web Footer Update Successfully',
                webFooter,
            });
        }
        const webFooter = yield webFooter_1.default.create(validateRequest.value);
        res.status(201).json({
            status: 201,
            message: 'Web Footer Created Successfully',
            webFooter,
        });
    }
    catch (error) {
        console.error('Error in createWebFooter:', error);
        res.status(500).json({
            status: 500,
            message: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.createWebFooter = createWebFooter;
const getWebFooter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webFooter = yield webFooter_1.default.findOne();
        if (!webFooter) {
            return res.status(404).json({
                status: 404,
                message: 'Web Footer Not Found',
            });
        }
        res.status(200).json({
            status: 200,
            message: 'Web Footer Fetched Successfully',
            webFooter,
        });
    }
    catch (error) {
        console.error('Error in getWebFooter:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
});
exports.getWebFooter = getWebFooter;
