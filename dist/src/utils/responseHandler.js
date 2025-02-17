"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = __importDefault(require("./messages"));
/**
 *
 * @param {obj} req : request from controller.
 * @param {obj} res : response from controller.
 * @param {*} next : executes the middleware succeeding the current middleware.
 */
const responseHandler = (req, res, next) => {
    const lang = 'en';
    /* When everything is ok. */
    res.ok = (data) => {
        messages_1.default.successResponse(data, res, lang);
    };
    /* Some issues arraised due to user mistake such as invalid data format of data */
    res.badRequest = (data) => {
        messages_1.default.badRequest(data, res, lang);
    };
    /* This is when something went wrong or the task was not performed properly */
    res.failureResponse = (data) => {
        messages_1.default.failureResponse(data, res, lang);
    };
    /* This is when the parameters are missing */
    res.insufficientParameters = (data) => {
        messages_1.default.insufficientParameters(data, res, lang);
    };
    /* This is when a user is trying to access data without token */
    res.unAuthorizedRequest = (data) => {
        messages_1.default.unAuthorizedRequest(data, res, lang);
    };
    /* User is authenticated but doesn't have rights to access the requested data */
    res.accessForbidden = (data) => {
        messages_1.default.accessForbidden(data, res, lang);
    };
    /* Use for data not found */
    res.dataNotFound = (data) => {
        messages_1.default.dataNotFound(data, res, lang);
    };
    next();
};
exports.default = responseHandler;
