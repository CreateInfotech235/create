"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const WebFooterSchema = new mongoose_1.default.Schema({
    logo: {
        type: String,
    },
    description: {
        type: String,
    },
    gellary: [{
            type: String,
        }],
    socialMedia: [{
            type: String,
        }],
    extraLinks: [{
            title: {
                type: String,
            },
            subLink: [
                {
                    title: {
                        type: String,
                    },
                    link: {
                        type: String,
                    }
                }
            ],
        }],
    copyright: {
        type: String,
    },
});
exports.default = mongoose_1.default.model('WebFooter', WebFooterSchema);
