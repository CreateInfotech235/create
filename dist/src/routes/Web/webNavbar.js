"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webNavbar_1 = require("../../controller/web/webNavbar");
// import adminAuth from '../../middleware/admin.auth';
const router = express_1.default.Router();
router.get('/', webNavbar_1.getWebNavbar);
router.post('/create', webNavbar_1.createWebNavbar);
exports.default = router;
