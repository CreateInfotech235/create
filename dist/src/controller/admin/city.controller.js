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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCity = exports.getCountryNames = exports.getDayWiseChargesByCity = exports.getCities = exports.updateCity = exports.createCity = exports.updateDayWiseCharges = exports.createDayWiseCharges = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const city_schema_1 = __importDefault(require("../../models/city.schema"));
const country_schema_1 = __importDefault(require("../../models/country.schema"));
const dayWiseFixedCharges_schema_1 = __importDefault(require("../../models/dayWiseFixedCharges.schema"));
const order_schema_1 = __importDefault(require("../../models/order.schema"));
const productCharges_schema_1 = __importDefault(require("../../models/productCharges.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const city_validation_1 = require("../../utils/validation/city.validation");
const createDayWiseCharges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, city_validation_1.createDayWiseChargeValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const checkCharge = yield productCharges_schema_1.default.findOne({
            _id: value.productChargeId,
            cityId: value.cityId,
        });
        if (!checkCharge) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').errorDataNotFound,
            });
        }
        if (value.hours) {
            value.dayInMs = value.hours * 3600 * 1000;
        }
        const data = yield dayWiseFixedCharges_schema_1.default
            .findOne({ productChargeId: value.productChargeId })
            .sort({ dayNumber: -1 });
        if (data) {
            value.dayNumber = data.dayNumber + 1;
        }
        else {
            value.dayNumber = 1;
        }
        value.charge = value.fixedCharge;
        yield dayWiseFixedCharges_schema_1.default.create(value);
        return res.ok({});
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createDayWiseCharges = createDayWiseCharges;
const updateDayWiseCharges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, city_validation_1.updateDayWiseChargeValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const checkCharge = yield productCharges_schema_1.default.findOne({
            _id: value.productChargeId,
            cityId: value.cityId,
        });
        if (!checkCharge) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').errorDataNotFound,
            });
        }
        if (value.hours) {
            value.dayInMs = value.hours * 3600 * 1000;
        }
        if (value.fixedCharge) {
            value.charge = value.fixedCharge;
        }
        yield dayWiseFixedCharges_schema_1.default.updateOne({ productChargeId: value.productChargeId, dayNumber: value.dayNumber }, { $set: value });
        return res.ok({});
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateDayWiseCharges = updateDayWiseCharges;
const createCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, city_validation_1.createCityValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const country = yield country_schema_1.default.findById(value.countryID);
        if (!country) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').countryNotFound });
        }
        const checkCityExist = yield city_schema_1.default.findOne({
            cityName: value.cityName,
        });
        if (!checkCityExist) {
            const city = yield city_schema_1.default.create({
                cityName: value.cityName,
                countryID: country._id,
                commissionType: value.commissionType,
            });
            value.cityId = city._id.toString();
        }
        const checkData = yield productCharges_schema_1.default.findOne({
            cityId: value.cityId,
            pickupRequest: value.pickupRequest,
            isCustomer: false,
        });
        if (checkData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorDataNotFound });
        }
        yield productCharges_schema_1.default.create(value);
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').cityCreated });
    }
    catch (error) {
        console.log('error', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createCity = createCity;
const updateCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.body, req.params);
        const validateRequest = (0, validateRequest_1.default)(req.body, city_validation_1.updateCityValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const country = yield country_schema_1.default.findById(value.countryID);
        if (!country) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').countryNotFound });
        }
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
            city: value.cityId,
        });
        const isPendingOrders = pendingOrders.length !== 0;
        if ('commissionType' in value && isPendingOrders) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').orderNotDelivered });
        }
        let $set = {};
        if (value.cityName || value.commissionType || value.countryID) {
            let { cityName, commissionType, countryID } = value, other = __rest(value, ["cityName", "commissionType", "countryID"]);
            $set = other;
            yield city_schema_1.default.updateOne({ _id: value.cityId }, {
                $set: Object.assign(Object.assign(Object.assign({}, (cityName && { cityName: cityName })), (commissionType && { commissionType })), (countryID && { countryID })),
            });
        }
        if (!isPendingOrders && JSON.stringify($set) !== '{}') {
            yield productCharges_schema_1.default.updateOne({ cityId: value.cityId }, {
                $set,
            });
        }
        else if (isPendingOrders) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').orderNotDelivered });
        }
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').cityUpdated });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateCity = updateCity;
const getCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, city_validation_1.cityListValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield city_schema_1.default.aggregate([
            {
                $match: Object.assign({}, (value.cityName && {
                    cityName: { $regex: value.cityName, $options: 'i' },
                })),
            },
            {
                $lookup: {
                    from: 'country',
                    localField: 'countryID',
                    foreignField: '_id',
                    as: 'countryData',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                countryName: 1,
                                currency: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$countryData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'ProductCharges',
                    localField: '_id',
                    foreignField: 'cityId',
                    as: 'productChargeData',
                    pipeline: [
                        {
                            $match: {
                                isCustomer: false,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$productChargeData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    cityId: '$_id',
                    cityName: '$cityName',
                    countryID: 1,
                    countryName: '$countryData.countryName',
                    currency: '$countryData.currency',
                    productChargeId: '$productChargeData._id',
                    minimumDistance: '$productChargeData.minimumDistance',
                    minimumWeight: '$productChargeData.minimumWeight',
                    cancelCharge: '$productChargeData.cancelCharge',
                    perDistanceCharge: '$productChargeData.perDistanceCharge',
                    perWeightCharge: '$productChargeData.perWeightCharge',
                    adminCommission: '$productChargeData.adminCommission',
                    commissionType: '$productChargeData.commissionType',
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
exports.getCities = getCities;
const getDayWiseChargesByCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.query, req.params);
        const validateRequest = (0, validateRequest_1.default)(req.query, city_validation_1.dayChargesListValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield dayWiseFixedCharges_schema_1.default.aggregate([
            {
                $match: {
                    productChargeId: new mongoose_1.default.Types.ObjectId(value.productChargeId),
                },
            },
            {
                $sort: {
                    dayNumber: 1,
                },
            },
            {
                $project: {
                    _id: 0,
                    dayNumber: 1,
                    title: 1,
                    hours: { $divide: [{ $divide: ['$dayInMs', 1000] }, 86400] },
                    charge: 1,
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
exports.getDayWiseChargesByCity = getDayWiseChargesByCity;
const getCountryNames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                    name: 1,
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
exports.getCountryNames = getCountryNames;
const deleteCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cityId } = req.params;
        if (!cityId) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').noCityFound });
        }
        const city = yield city_schema_1.default.findById(cityId);
        if (!city) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').noCityFound });
        }
        yield city_schema_1.default.deleteOne({ _id: cityId });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').cityDeleted });
    }
    catch (error) {
        console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteCity = deleteCity;
