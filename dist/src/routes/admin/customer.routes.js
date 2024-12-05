"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../../controller/admin/customer.controller");
const router = (0, express_1.Router)();
// /**
//  * @swagger
//  * /admin/customer/addCustomer:
//  *   post:
//  *     security:
//  *      - bearerAuth: []
//  *     summary: Add Customer
//  *     tags: [ Admin - Customer ]
//  *     requestBody:
//  *      description: for add customer
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            type: object
//  *            properties:
//  *              name:
//  *                type: string
//  *              email:
//  *                type: string
//  *              contactNumber:
//  *                type: number
//  *              countryCode:
//  *                type: string
//  *              address:
//  *                type: string
//  *              city:
//  *                type: string
//  *              country:
//  *                type: string
//  *              pincode:
//  *                type: number
//  *     responses:
//  *       200:
//  *         description: Your request is successfully executed.
//  *       400:
//  *         description: Bad Request Client Error
//  *       500:
//  *         description: Something went wrong
//  */
router.post('/addCustomer', customer_controller_1.addCustomer);
exports.default = router;
