"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controller/customer/auth.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /customer/auth/signUp:
 *   post:
 *     summary: Create new customer
 *     tags: [ Customer - Auth ]
 *     requestBody:
 *       description: Customer signup details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/customerSignUpValidation"
 *     responses:
 *       200:
 *         description: Customer created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Something went wrong
 */
router.post('/signUp', auth_controller_1.createCustomer);
router.post('/signUpExal', auth_controller_1.createCustomerExal);
/**
 * @swagger
 * /customer/auth/customerUpdate/{id}:
 *   patch:
 *     summary: Update customer details
 *     tags: [ Customer - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Customer update details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/customerUpdateValidation"
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Something went wrong
 */
router.patch('/customerUpdate/:id', auth_controller_1.updateCustomer);
/**
 * @swagger
 * /customer/auth/getCustomers:
 *   get:
 *     summary: Get all customers
 *     tags: [ Customer - Auth ]
 *     parameters:
 *       - in: query
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the merchant to get customers for
 *     responses:
 *       200:
 *         description: List of customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       cityId:
 *                         type: string
 *                       city:
 *                         type: string
 *                       country:
 *                         type: string
 *                       countryName:
 *                         type: string
 *                       address:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       mobileNumber:
 *                         type: string
 *                       postCode:
 *                         type: string
 *                       location:
 *                         type: object
 *                       createdDate:
 *                         type: string
 *                       customerId:
 *                         type: string
 *                       merchantId:
 *                         type: string
 *                       trashed:
 *                         type: boolean
 *       500:
 *         description: Something went wrong
 */
router.get('/getCustomers', auth_controller_1.getCustomers);
/**
 * @swagger
 * /customer/auth/getCities:
 *   get:
 *     summary: Get all cities
 *     tags: [ Customer - Auth ]
 *     responses:
 *       200:
 *         description: List of cities retrieved successfully
 *       500:
 *         description: Something went wrong
 */
router.get('/getCities', auth_controller_1.getCities);
/**
 * @swagger
 * /customer/auth/getCountries:
 *   get:
 *     summary: Get all countries
 *     tags: [ Customer - Auth ]
 *     responses:
 *       200:
 *         description: List of countries retrieved successfully
 *       500:
 *         description: Something went wrong
 */
router.get('/getCountries', auth_controller_1.getCountries);
/**
 * @swagger
 * /customer/auth/deleteCustomer/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [ Customer - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Something went wrong
 */
router.delete('/deleteCustomer/:id', auth_controller_1.deleteCustomerById);
/**
 * @swagger
 * /customer/auth/moveToTrashCustomer/{id}:
 *   patch:
 *     summary: Move customer to trash
 *     tags: [ Customer - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer moved to trash successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Something went wrong
 */
router.patch('/moveToTrashCustomer/:id', auth_controller_1.moveToTrashCustomer);
exports.default = router;
