"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webFooter_1 = require("../../controller/web/webFooter");
const admin_auth_1 = __importDefault(require("../../middleware/admin.auth"));
const router = express_1.default.Router();
router.get('/', webFooter_1.getWebFooter);
router.patch('/update', admin_auth_1.default, webFooter_1.updateWebFooter);
router.post('/create', admin_auth_1.default, webFooter_1.createWebFooter);
exports.default = router;
