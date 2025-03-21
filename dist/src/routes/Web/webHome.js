"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webhome_1 = require("../../controller/web/webhome");
const router = express_1.default.Router();
// router.get('/', getWebLandingpage);
router.post('/landingpage', webhome_1.createWebhomelandingpage);
router.get('/landingpage', webhome_1.getWebLandingPage);
exports.default = router;
