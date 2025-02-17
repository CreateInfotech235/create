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
exports.updateWebFooter = exports.getWebFooter = exports.createWebFooter = void 0;
const webFooter_1 = __importDefault(require("../../models/webFooter"));
const createWebFooter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Bad Request: Missing or invalid data",
            });
        }
        console.log("Create Web Footer", req.body);
        const webFooter = yield webFooter_1.default.create(req.body);
        res.status(201).json({
            status: 201,
            message: "Web Footer Created Successfully",
            webFooter,
        });
    }
    catch (error) {
        console.error("Error in createWebFooter:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
});
exports.createWebFooter = createWebFooter;
const getWebFooter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webFooter = yield webFooter_1.default.findOne();
        if (!webFooter) {
            return res.status(404).json({
                status: 404,
                message: "Web Footer Not Found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "Web Footer Fetched Successfully",
            webFooter,
        });
    }
    catch (error) {
        console.error("Error in getWebFooter:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
});
exports.getWebFooter = getWebFooter;
const updateWebFooter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Bad Request: Missing or invalid data",
            });
        }
        const webFooter = yield webFooter_1.default.findOneAndUpdate({}, req.body, { new: true });
        if (!webFooter) {
            return res.status(404).json({
                status: 404,
                message: "Web Footer Not Found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "Web Footer Updated Successfully",
            webFooter,
        });
    }
    catch (error) {
        console.error("Error in updateWebFooter:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
});
exports.updateWebFooter = updateWebFooter;
