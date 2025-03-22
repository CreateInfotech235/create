"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Billing_controller_1 = require("../../controller/admin/Billing.controller");
const router = express_1.default.Router();
router.get('/getBilling', Billing_controller_1.getBilling);
exports.default = router;
