"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseCode_1 = __importDefault(require("./responseCode"));
exports.default = {
    successResponse: (data, res, lang) => res.status(responseCode_1.default.success).json({
        status: 'SUCCESS',
        message: data.message ||
            // language[lang]?.requestSuccessfull ||
            'Your request is successfully executed',
        data: data.data && Object.keys(data.data).length ? data.data : null,
    }),
    failureResponse: (data, res, lang) => res.status(responseCode_1.default.internalServerError).json({
        status: 'FAILURE',
        message: data.message ||
            // language[lang]?.somethingWentWrong ||
            'Internal server error.',
        data: data.data && Object.keys(data.data).length ? data.data : null,
    }),
    badRequest: (data, res, lang) => res.status(responseCode_1.default.badRequest).json({
        status: 'BAD_REQUEST',
        message: data.message ||
            // language[lang]?.badRequest ||
            'The request cannot be fulfilled due to bad syntax.',
        data: data.data && Object.keys(data.data).length ? data.data : null,
    }),
    insufficientParameters: (data, res, lang) => res.status(responseCode_1.default.badRequest).json({
        status: 'BAD_REQUEST',
        message: data.message ||
            // language[lang]?.parameterMissing ||
            'Insufficient parameters.',
        data: data.data && Object.keys(data.data).length ? data.data : null,
    }),
    unAuthorizedRequest: (data, res, lang) => res.status(responseCode_1.default.unAuthorizedRequest).json({
        status: 'UNAUTHORIZED',
        message: data.message ||
            // language[lang]?.unauthorizedUser ||
            'You are not authorized to access the request.',
        data: data.data && Object.keys(data.data).length ? data.data : null,
    }),
    accessForbidden: (data, res, lang) => res.status(responseCode_1.default.accessForbidden).json({
        status: 'ACCESS_FORBIDEN',
        message: data.message ||
            // language[lang]?.accessForbidden ||
            'You are not authorized to access the request.',
        data: data.data && Object.keys(data.data).length ? data.data : null,
    }),
    dataNotFound: (data, res, lang) => res.status(responseCode_1.default.notFound).json({
        status: 'NOT_FOUND',
        message: data.message || /*language[lang]?.notFound ||*/ 'Data not found.',
        data: data.data && Object.keys(data.data).length ? data.data : null,
    }),
};
