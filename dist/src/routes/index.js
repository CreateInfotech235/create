"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = __importDefault(require("./admin"));
const deliveryBoy_1 = __importDefault(require("./deliveryBoy"));
const mobile_1 = __importDefault(require("./mobile"));
const customer_1 = __importDefault(require("./customer"));
const router = express_1.default.Router();
router.use('/admin', admin_1.default);
router.use('/deliveryBoy', deliveryBoy_1.default);
router.use('/mobile', mobile_1.default);
router.use('/customer', customer_1.default);
exports.default = router;
