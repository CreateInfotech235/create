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
exports.deleteCountry = exports.getCitiesByCountry = exports.getCountries = exports.updateCountry = exports.createCountry = void 0;
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const city_schema_1 = __importDefault(require("../../models/city.schema"));
const country_schema_1 = __importDefault(require("../../models/country.schema"));
const order_schema_1 = __importDefault(require("../../models/order.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const country_validation_1 = require("../../utils/validation/country.validation");
const createCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, country_validation_1.createCountryValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        if (yield country_schema_1.default.findOne({ countryName: value.countryName })) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').countryRegisteredAlready,
            });
        }
        value.countryName = value.countryName;
        yield country_schema_1.default.create(value);
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').countryCreated });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createCountry = createCountry;
const updateCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.body, req.params);
        const validateRequest = (0, validateRequest_1.default)(req.body, country_validation_1.updateCountryValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const orderStatus = [
            enum_1.ORDER_HISTORY.CREATED,
            enum_1.ORDER_HISTORY.ASSIGNED,
            enum_1.ORDER_HISTORY.ARRIVED,
            enum_1.ORDER_HISTORY.DEPARTED,
            enum_1.ORDER_HISTORY.PICKED_UP,
            enum_1.ORDER_HISTORY.DELAYED,
        ];
        const pendingOrders = yield order_schema_1.default.find({
            status: { $in: orderStatus },
            isCustomer: false,
            country: value.countryId,
        });
        const isPendingOrders = pendingOrders.length !== 0;
        if (('distanceType' in value || 'weightType' in value) && isPendingOrders) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').orderNotDelivered });
        }
        if (value.countryName) {
            value.countryName = value.countryName;
        }
        yield country_schema_1.default.updateOne({ _id: value.countryId }, { $set: value });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').countryUpdated });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateCountry = updateCountry;
const getCountries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.paginationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield country_schema_1.default.aggregate([
            {
                $project: {
                    _id: 0,
                    countryId: '$_id',
                    countryName: '$countryName',
                    distanceType: 1,
                    weightType: 1,
                    createdDate: '$createdAt',
                    isActive: 1,
                },
            },
            ...(0, common_1.getMongoCommonPagination)({
                pageCount: value.pageCount,
                pageLimit: value.pageLimit,
            }),
        ]);
        return res.ok({ data: data[0] });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getCountries = getCountries;
const getCitiesByCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.params, req.query);
        const validateRequest = (0, validateRequest_1.default)(req.params, country_validation_1.countryWiseCityValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield city_schema_1.default.aggregate([
            {
                $match: {
                    countryID: value.countryID,
                },
            },
            {
                $project: {
                    _id: 0,
                    cityId: '$_id',
                    cityName: 1,
                },
            },
            ...(0, common_1.getMongoCommonPagination)({
                pageCount: value.pageCount,
                pageLimit: value.pageLimit,
            }),
        ]);
        return res.ok({ data: data[0] });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getCitiesByCountry = getCitiesByCountry;
const deleteCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { countryId } = req.params;
        if (!countryId) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').noCountryFound });
        }
        const country = yield country_schema_1.default.findById(countryId);
        if (!country) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').noCountryFound });
        }
        yield country_schema_1.default.deleteOne({ _id: countryId });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').countryDeleted });
    }
    catch (error) {
        console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteCountry = deleteCountry;
