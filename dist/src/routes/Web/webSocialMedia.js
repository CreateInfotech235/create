"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webSocialMedia_1 = require("../../controller/web/webSocialMedia");
// import adminAuth from '../../middleware/admin.auth';
const router = express_1.default.Router();
router.get('/', webSocialMedia_1.getWebSocialMedia);
router.post('/create', webSocialMedia_1.createWebSocialMedia);
exports.default = router;
