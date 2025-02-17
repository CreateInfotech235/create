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
exports.getExtraCharges = exports.deleteExtraCharge = exports.updateExtraCharges = exports.createExtraCharges = void 0;
const languageHelper_1 = require("../../language/languageHelper");
const extraCharges_schema_1 = __importDefault(require("../../models/extraCharges.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const extraCharges_validation_1 = require("../../utils/validation/extraCharges.validation");
const createExtraCharges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, extraCharges_validation_1.createExtraChargesValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        yield extraCharges_schema_1.default.create(value);
        return res.ok({});
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createExtraCharges = createExtraCharges;
const updateExtraCharges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.body, req.params);
        const validateRequest = (0, validateRequest_1.default)(req.body, extraCharges_validation_1.updateExtraChargesValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const checkExtraChargeExist = yield extraCharges_schema_1.default.findById(value.extraChargeId);
        if (!checkExtraChargeExist) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorDataNotFound });
        }
        yield extraCharges_schema_1.default.updateOne({ _id: value.extraChargeId }, { $set: value });
        return res.ok({});
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateExtraCharges = updateExtraCharges;
const deleteExtraCharge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.params, req.body);
        const validateRequest = (0, validateRequest_1.default)(req.params, extraCharges_validation_1.deleteExtraChargesValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const checkVehicleExist = yield extraCharges_schema_1.default.findById(value.extraChargeId);
        if (!checkVehicleExist) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorDataNotFound });
        }
        yield extraCharges_schema_1.default.updateOne({ _id: value.extraChargeId }, { $set: value });
        return res.ok({});
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteExtraCharge = deleteExtraCharge;
const getExtraCharges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.paginationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield extraCharges_schema_1.default.aggregate([
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: 'country',
                    localField: 'country',
                    foreignField: '_id',
                    as: 'countryData',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                name: 1,
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
                    from: 'city',
                    localField: 'city',
                    foreignField: '_id',
                    as: 'cityData',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$cityData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    extraChargeId: '$_id',
                    title: 1,
                    charge: 1,
                    chargeType: 1,
                    country: '$countryData.countryName',
                    city: '$cityData.cityName',
                    status: '$status',
                    createdDate: '$createdAt',
                },
            },
            ...(0, common_1.getMongoCommonPagination)({
                pageCount: value.pageCount,
                pageLimit: value.pageLimit,
            }),
        ]);
        return res.ok({ data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getExtraCharges = getExtraCharges;
