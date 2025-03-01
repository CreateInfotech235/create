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
exports.getWebNavbar = exports.createWebNavbar = void 0;
const webNavbar_schema_1 = __importDefault(require("../../models/webNavbar.schema"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const web_validation_1 = require("../../utils/validation/web.validation");
const createWebNavbar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body", req.body);
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, web_validation_1.webNavbarValidation);
        console.log("validateRequest", validateRequest);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const isfasttimecreate = yield webNavbar_schema_1.default.findOne();
        console.log("isfasttimecreate", isfasttimecreate);
        if (isfasttimecreate) {
            yield webNavbar_schema_1.default.updateOne({}, { $set: validateRequest.value });
            return res.status(200).json({
                status: 200,
                message: "Web Navbar Updated Successfully",
            });
        }
        console.log("validateRequest.value", validateRequest.value);
        const webNavbar = yield webNavbar_schema_1.default.create(validateRequest.value);
        res.status(201).json({
            status: 201,
            message: "Web Navbar Created Successfully",
            webNavbar,
        });
    }
    catch (error) {
        console.error("Error in createWebNavbar:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
});
exports.createWebNavbar = createWebNavbar;
const getWebNavbar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webNavbar = yield webNavbar_schema_1.default.findOne();
        if (!webNavbar) {
            return res.status(404).json({
                status: 404,
                message: "Web Navbar Not Found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "Web Navbar Fetched Successfully",
            webNavbar,
        });
    }
    catch (error) {
        console.error("Error in getWebNavbar:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
});
exports.getWebNavbar = getWebNavbar;
