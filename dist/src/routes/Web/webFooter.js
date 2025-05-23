"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webFooter_1 = require("../../controller/web/webFooter");
const router = express_1.default.Router();
router.get('/', webFooter_1.getWebFooter);
router.post('/create', webFooter_1.createWebFooter);
exports.default = router;
