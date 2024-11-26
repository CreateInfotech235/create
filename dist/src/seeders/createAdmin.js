"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_schema_1 = __importDefault(require("../models/admin.schema"));
const adminSettings_schema_1 = __importDefault(require("../models/adminSettings.schema"));
const currency_schema_1 = __importDefault(require("../models/currency.schema"));
const common_1 = require("../utils/common");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield admin_schema_1.default.find()).length === 0) {
        const data = JSON.parse(process.env.ADMIN_DATA);
        data.password = yield (0, common_1.encryptPassword)({ password: data.password });
        yield admin_schema_1.default.create(data);
    }
    if ((yield adminSettings_schema_1.default.find()).length === 0) {
        let currency = yield currency_schema_1.default.findOne();
        if (!currency) {
            currency = yield currency_schema_1.default.create({
                name: 'Pound',
                symbol: '£',
                position: 'right',
            });
        }
        yield adminSettings_schema_1.default.create({ currency: currency._id });
    }
});
