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
exports.updateWebHome = exports.getWebHome = exports.createWebHome = void 0;
const webHome_schema_1 = __importDefault(require("../../models/webHome.schema"));
const createWebHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Create Web Home", req.body);
        const webHome = yield webHome_schema_1.default.create(req.body);
        res.status(201).json({
            status: 201,
            message: "Web Home Created Successfully",
            webHome
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error
        });
    }
});
exports.createWebHome = createWebHome;
const getWebHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webHome = yield webHome_schema_1.default.findOne();
        res.status(200).json({
            status: 200,
            message: "Web Home Fetched Successfully",
            webHome
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error
        });
    }
});
exports.getWebHome = getWebHome;
const updateWebHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webHome = yield webHome_schema_1.default.findOneAndUpdate({}, req.body, { new: true });
        res.status(201).json({
            status: 201,
            message: "Web Home Updated Successfully",
            webHome
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error
        });
    }
});
exports.updateWebHome = updateWebHome;
