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
exports.getDocuments = exports.deleteDocument = exports.updateDocument = exports.createDocument = void 0;
const languageHelper_1 = require("../../language/languageHelper");
const document_schema_1 = __importDefault(require("../../models/document.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const document_validation_1 = require("../../utils/validation/document.validation");
const createDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, document_validation_1.createDocumentValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const documentExist = yield document_schema_1.default.findOne({ name: value.name });
        if (documentExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').errorDocumentAlreadyExist,
            });
        }
        yield document_schema_1.default.create(value);
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').documentCreated });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createDocument = createDocument;
const updateDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.documentId = req.params.documentId;
        const validateRequest = (0, validateRequest_1.default)(req.body, document_validation_1.updateDocumentValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const documentExist = yield document_schema_1.default.findById(value.documentId);
        if (!documentExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').errorDocumentNotFound,
            });
        }
        yield document_schema_1.default.updateOne({ _id: value.documentId }, { $set: { name: value.name, isRequired: value.isRequired } });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').documentUpdated });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateDocument = updateDocument;
const deleteDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.params.status = req.query.status;
        const validateRequest = (0, validateRequest_1.default)(req.params, document_validation_1.deleteDocumentValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const documentExist = yield document_schema_1.default.findById(value.documentId);
        if (!documentExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').errorDocumentNotFound,
            });
        }
        yield document_schema_1.default.updateOne({ _id: value.documentId }, { $set: { status: value.status } });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').documentUpdated });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteDocument = deleteDocument;
const getDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.paginationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        return res.ok({
            data: (yield document_schema_1.default.aggregate([
                {
                    $project: {
                        name: 1,
                        isRequired: 1,
                        isEnable: '$status',
                    },
                },
                ...(0, common_1.getMongoCommonPagination)({
                    pageCount: value.pageCount,
                    pageLimit: value.pageLimit,
                }),
            ]))[0],
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getDocuments = getDocuments;
