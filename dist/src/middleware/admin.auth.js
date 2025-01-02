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
const jsonwebtoken_1 = require("jsonwebtoken");
const languageHelper_1 = require("../language/languageHelper");
const admin_schema_1 = __importDefault(require("../models/admin.schema"));
const authToken_schema_1 = __importDefault(require("../models/authToken.schema"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bearerToken = req.headers.authorization;
        if (!(bearerToken === null || bearerToken === void 0 ? void 0 : bearerToken.includes('Bearer'))) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const token = bearerToken.split(' ');
        const data = (0, jsonwebtoken_1.verify)(token[1], process.env.ACCESS_SECRET_KEY);
        if (!data) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const tokenExpired = yield authToken_schema_1.default.findOne({
            $or: [{ accessToken: token }, { refreshToken: token }],
            isActive: false,
        });
        if (!tokenExpired) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const checkUserExist = yield admin_schema_1.default.findById(data.id);
        if (!checkUserExist) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        req.id = checkUserExist._id;
        req.language = checkUserExist.language;
        next();
    }
    catch (error) {
        console.log('🚀 ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
