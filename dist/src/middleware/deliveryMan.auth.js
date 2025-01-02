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
const enum_1 = require("../enum");
const languageHelper_1 = require("../language/languageHelper");
const token_schema_1 = __importDefault(require("../models/token.schema"));
const deliveryMan_schema_1 = __importDefault(require("../models/deliveryMan.schema"));
const deliveryManDocument_schema_1 = __importDefault(require("../models/deliveryManDocument.schema"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bearerToken = req.headers.authorization;
        if (!(bearerToken === null || bearerToken === void 0 ? void 0 : bearerToken.includes('Bearer'))) {
            // return res.badRequest({ statusCode : 123 , message: getLanguage('en').invalidToken });
            return res
                .status(401)
                .json({ status: 123, message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        console.log('Hello');
        const token = bearerToken.split(' ');
        const data = (0, jsonwebtoken_1.verify)(token[1], process.env.ACCESS_SECRET_KEY);
        if (!data) {
            // return res.badRequest({statusCode : 123 , message: getLanguage('en').invalidToken });
            return res
                .status(401)
                .json({ status: 123, message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const tokenExpired = yield token_schema_1.default.findOne({
            $or: [{ accessToken: token }, { refreshToken: token }],
        });
        if (!tokenExpired) {
            // return res.badRequest({statusCode : 123 , message: getLanguage('en').invalidToken });
            return res
                .status(401)
                .json({ status: 123, message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const checkUserExist = yield deliveryMan_schema_1.default.findById(data.id);
        if (!checkUserExist) {
            // return res.badRequest({statusCode : 123 , message: getLanguage('en').invalidToken });
            return res
                .status(401)
                .json({ status: 123, message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        if (checkUserExist.status === 'DISABLE') {
            return res
                .status(401)
                .json({
                status: 401,
                message: (0, languageHelper_1.getLanguage)('en').deliveryManInactive,
                data: null,
            });
        }
        const checkDocumentsApproved = yield deliveryManDocument_schema_1.default.find({ deliveryManId: data.id }, { _id: 0, status: 1 });
        if (checkDocumentsApproved.some((i) => i.status === enum_1.SUBCRIPTION_REQUEST.PENDING)) {
            // return res.badRequest({
            //   message: getLanguage('en').errorDocumentVerified,
            // });
            return res
                .status(401)
                .json({
                status: 123,
                message: (0, languageHelper_1.getLanguage)('en').errorDocumentVerified,
            });
        }
        req.id = checkUserExist._id;
        req.language = checkUserExist.language;
        next();
    }
    catch (error) {
        // return res.failureResponse({
        //   statusCode: 123,
        //   message: getLanguage('en').invalidToken,
        // });
        return res
            .status(401)
            .json({ status: 123, message: (0, languageHelper_1.getLanguage)('en').invalidToken });
    }
});
