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
exports.getVehiclesForAll = exports.getVehicles = exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = void 0;
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const vehicle_schema_1 = __importDefault(require("../../models/vehicle.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const vehicle_validation_1 = require("../../utils/validation/vehicle.validation");
const createVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, vehicle_validation_1.createVehicleValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const image = value.image.split(',');
        value.image = yield (0, common_1.uploadFile)(image[0], image[1], 'VEHICLE');
        value.cityType = value.cityWise;
        yield vehicle_schema_1.default.create(value);
        return res.ok({});
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createVehicle = createVehicle;
const updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.body, req.params);
        const validateRequest = (0, validateRequest_1.default)(req.body, vehicle_validation_1.updateVehicleValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const checkVehicleExist = yield vehicle_schema_1.default.findById(value.vehicleId);
        if (!checkVehicleExist) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorDataNotFound });
        }
        if (value.cityWise === enum_1.VEHICLE_CITY_TYPE.CITY_WISE && !value.city) {
            return res.ok({ message: (0, languageHelper_1.getLanguage)('en').errorCityFieldRequired });
        }
        else if (value.cityWise === enum_1.VEHICLE_CITY_TYPE.ALL) {
            value.city = [];
        }
        if (value.image) {
            (0, common_1.removeUploadedFile)(checkVehicleExist.image);
            const image = value.image.split(',');
            value.image = yield (0, common_1.uploadFile)(image[0], image[1], 'VEHICLE');
        }
        if (value.cityWise) {
            value.cityType = value.cityWise;
        }
        yield vehicle_schema_1.default.updateOne({ _id: value.vehicleId }, { $set: value });
        return res.ok({});
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateVehicle = updateVehicle;
const deleteVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.params, req.body);
        const validateRequest = (0, validateRequest_1.default)(req.params, vehicle_validation_1.deleteVehicleValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const checkVehicleExist = yield vehicle_schema_1.default.findById(value.vehicleId);
        if (!checkVehicleExist) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorDataNotFound });
        }
        yield vehicle_schema_1.default.updateOne({ _id: value.vehicleId }, { $set: value });
        return res.ok({});
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteVehicle = deleteVehicle;
const getVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.paginationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield vehicle_schema_1.default.aggregate([
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $project: {
                    _id: 0,
                    vehicleId: '$_id',
                    vehicleImage: '$image',
                    vehicleName: '$name',
                    vehicleSize: '$size',
                    vehicleCapacity: '$capacity',
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
exports.getVehicles = getVehicles;
const getVehiclesForAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield vehicle_schema_1.default.aggregate([
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $project: {
                    _id: 0,
                    vehicleId: '$_id',
                    vehicleImage: '$image',
                    vehicleName: '$name',
                    vehicleSize: '$size',
                    vehicleCapacity: '$capacity',
                    status: '$status',
                    createdDate: '$createdAt',
                },
            },
        ]);
        return res.ok({ data: data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getVehiclesForAll = getVehiclesForAll;
