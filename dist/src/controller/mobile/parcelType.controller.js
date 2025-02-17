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
exports.getParcelTypes = exports.deleteParcelType = exports.updateParcelTypes = exports.createParcelTypes = void 0;
const languageHelper_1 = require("../../language/languageHelper");
const parcel_schema_1 = __importDefault(require("../../models/parcel.schema"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const mongoose_1 = __importDefault(require("mongoose"));
const createParcelTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, adminSide_validation_1.createParcelValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const merchant = req.id;
        const checkParcelType = yield parcel_schema_1.default.findOne({
            label: { $regex: value.label, $options: 'i' },
            merchant: merchant,
        });
        if (checkParcelType) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').errorParcelTypeAlreadyRegistered,
            });
        }
        yield parcel_schema_1.default.create(Object.assign(Object.assign({}, value), { merchant: merchant }));
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').parcelTypeCreated });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createParcelTypes = createParcelTypes;
const updateParcelTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.body, req.params);
        const validateRequest = (0, validateRequest_1.default)(req.body, adminSide_validation_1.updateParcelValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const merchant = req.id;
        const checkParcelTypeExist = yield parcel_schema_1.default.findById(value.parcelTypeId);
        if (!checkParcelTypeExist) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorDataNotFound });
        }
        yield parcel_schema_1.default.updateOne({ _id: value.parcelTypeId }, { $set: Object.assign(Object.assign({}, value), { merchant }) });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').parcelTypeUpdated });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateParcelTypes = updateParcelTypes;
const deleteParcelType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.params, req.body);
        const validateRequest = (0, validateRequest_1.default)(req.params, adminSide_validation_1.deleteParcelValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const merchant = req.id;
        const checkParcelTypeExist = yield parcel_schema_1.default.findById(value.parcelTypeId);
        if (!checkParcelTypeExist) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorDataNotFound });
        }
        yield parcel_schema_1.default.findByIdAndDelete(value.parcelTypeId);
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').parcelTypeDeleted });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteParcelType = deleteParcelType;
const getParcelTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const validateRequest = validateParamsWithJoi<IPagination>(
        //   req.query,
        //   paginationValidation,
        // );
        // if (!validateRequest.isValid) {
        //   return res.badRequest({ message: validateRequest.message });
        // }
        // const { value } = validateRequest;
        const merchant = req.params.merchantId;
        console.log(merchant);
        if (!merchant) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').merchantNotFound });
        }
        const data = yield parcel_schema_1.default.aggregate([
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $match: {
                    merchant: new mongoose_1.default.Types.ObjectId(merchant),
                },
            },
            {
                $project: {
                    _id: 0,
                    parcelTypeId: '$_id',
                    label: 1,
                    status: '$status',
                    createdDate: '$createdAt',
                },
            },
            // ...getMongoCommonPagination({
            //   pageCount: value.pageCount,
            //   pageLimit: value.pageLimit,
            // }),
        ]);
        return res.ok({ data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getParcelTypes = getParcelTypes;
