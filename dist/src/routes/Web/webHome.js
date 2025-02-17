"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webhome_1 = require("../../controller/web/webhome");
const admin_auth_1 = __importDefault(require("../../middleware/admin.auth"));
const router = express_1.default.Router();
router.get('/', webhome_1.getWebHome);
router.patch('/update', admin_auth_1.default, webhome_1.updateWebHome);
router.post('/create', admin_auth_1.default, webhome_1.createWebHome);
exports.default = router;
