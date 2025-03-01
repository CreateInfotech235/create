"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webHome_1 = __importDefault(require("./webHome"));
const webPricing_1 = __importDefault(require("./webPricing"));
const webFooter_1 = __importDefault(require("./webFooter"));
const webNavbar_1 = __importDefault(require("./webNavbar"));
const router = express_1.default.Router();
router.use('/home', webHome_1.default);
router.use('/pricing', webPricing_1.default);
router.use('/footer', webFooter_1.default);
router.use('/navbar', webNavbar_1.default);
exports.default = router;
