"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deliveryMan_auth_1 = __importDefault(require("../../middleware/deliveryMan.auth"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const location_routes_1 = __importDefault(require("./location.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const router = express_1.default.Router();
router.use('/auth', auth_routes_1.default);
router.use(deliveryMan_auth_1.default);
router.use('/orders', order_routes_1.default);
router.use('/location', location_routes_1.default);
exports.default = router;
