"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../../controller/admin/customer.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /admin/customer/addCustomer:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Add Customer
 *     tags: [ Admin - Customer ]
 *     requestBody:
 *      description: for add customer
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              country:
 *                type: string
 *              city:
 *                type: string
 *              address:
 *                type: string
 *              postCode:
 *                type: string
 *              mobileNumber:
 *                type: string
 *              email:
 *                type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/addCustomer', customer_controller_1.addCustomer);
/**
 * @swagger
 * /admin/customer/getAllCustomer:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get All Customer
 *     tags: [ Admin - Customer ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllCustomer', customer_controller_1.getAllCustomer);
/**
 * @swagger
 * /admin/customer/customerUpdate/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Update Customer
 *     tags: [ Admin - Customer ]
 *     parameters:
 *     - name: id
 *       in: path
 *     requestBody:
 *      description: for update customer
 *      required: false
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              country:
 *                type: string
 *              city:
 *                type: string
 *              address:
 *                type: string
 *              postCode:
 *                type: string
 *              mobileNumber:
 *                type: string
 *              email:
 *                type: string
 */
router.patch('/customerUpdate/:id', customer_controller_1.updateCustomer);
/**
 * @swagger
 * /admin/customer/deleteCustomer/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete Customer
 *     tags: [ Admin - Customer ]
 *     parameters:
 *     - name: id
 *       in: path
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/deleteCustomer/:id', customer_controller_1.deleteCustomerById);
exports.default = router;
