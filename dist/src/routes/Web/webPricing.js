"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webPricing_1 = require("../../controller/web/webPricing");
const admin_auth_1 = __importDefault(require("../../middleware/admin.auth"));
const router = express_1.default.Router();
router.get('/', webPricing_1.getWebPricing);
router.put('/update', admin_auth_1.default, webPricing_1.updateWebPricing);
router.post('/create', admin_auth_1.default, webPricing_1.createWebPricing);
exports.default = router;
