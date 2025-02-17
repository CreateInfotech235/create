"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getPaymentData_controller_1 = require("../../controller/admin/getPaymentData.controller");
const admin_auth_1 = __importDefault(require("../../middleware/admin.auth"));
const router = express_1.default.Router();
router.get('/getPaymentData', admin_auth_1.default, getPaymentData_controller_1.getPaymentData);
router.get('/gettotalPayment', getPaymentData_controller_1.getPaymentTotal);
exports.default = router;
