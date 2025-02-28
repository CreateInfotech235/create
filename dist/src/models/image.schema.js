"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const imageSchema = new mongoose_1.default.Schema({
    image: { type: String, required: true },
    imageName: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    projectName: { type: String, default: "Untitled" },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Image", imageSchema);
