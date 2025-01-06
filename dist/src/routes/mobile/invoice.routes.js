"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_controller_1 = require("../../controller/mobile/invoice.controller");
const router = (0, express_1.Router)();
``;
/**
 * @swagger
 * /mobile/invoice/create:
 *   post:
 *     summary: Create an invoice
 *     tags: [ Mobile - Invoice ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *               header:
 *                 type: string
 *               footer:
 *                 type: string
 *               merchantId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Invoice created successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/create', invoice_controller_1.createInvoice);
/**
 * @swagger
 * /mobile/invoice/{merchantId}:
 *   get:
 *     summary: Get an invoice
 *     tags: [ Mobile - Invoice ]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice retrieved successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/:merchantId', invoice_controller_1.getInvoice);
/**
 * @swagger
 * /mobile/invoice/update/{merchantId}:
 *   put:
 *     summary: Update an invoice
 *     tags: [ Mobile - Invoice ]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *               header:
 *                 type: string
 *               footer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.put('/update/:merchantId', invoice_controller_1.updateInvoice);
/**
 * @swagger
 * /mobile/invoice/delete/{merchantId}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [ Mobile - Invoice ]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/delete/:merchantId', invoice_controller_1.deleteInvoice);
exports.default = router;
