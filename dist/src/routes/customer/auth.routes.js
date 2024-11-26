"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controller/customer/auth.controller");
const router = express_1.default.Router();
router.post('/signUp', auth_controller_1.createCustomer);
router.patch('/customerUpdate/:id', auth_controller_1.updateCustomer);
router.get('/getCustomers', auth_controller_1.getCustomers);
router.get('/getCities', auth_controller_1.getCities);
router.get('/getCountries', auth_controller_1.getCountries);
router.delete('/deleteCustomer/:id', auth_controller_1.deleteCustomerById);
router.patch('/moveToTrashCustomer/:id', auth_controller_1.moveToTrashCustomer);
exports.default = router;
