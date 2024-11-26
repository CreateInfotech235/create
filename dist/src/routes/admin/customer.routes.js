"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../../controller/admin/customer.controller");
const router = (0, express_1.Router)();
router.post('/addCustomer', customer_controller_1.addCustomer);
exports.default = router;
