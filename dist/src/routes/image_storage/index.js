"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const image_controller_1 = require("../../controller/image_storage/image.controller");
const router = express_1.default.Router();
router.post("/upload", image_controller_1.uploadImage);
router.get("/getImage/:filename", image_controller_1.getImage);
router.patch("/updateImage", image_controller_1.updateImage);
router.delete("/deleteImage", image_controller_1.deleteImage);
exports.default = router;
