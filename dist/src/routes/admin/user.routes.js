"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deliveryMan_controller_1 = require("../../controller/admin/deliveryMan.controller");
const subcription_controller_1 = require("../../controller/admin/subcription.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /admin/users:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Subscribed/ Unsubscribed  Users
 *     tags: [ Admin - Users ]
 *     parameters:
 *     - name: isSubscribed
 *       in: query
 *     - name: pageCount
 *       in: query
 *     - name: pageLimit
 *       in: query
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/', subcription_controller_1.getUsers);
router.get('/getAllUsers', subcription_controller_1.getAllUsers);
router.get('/getAllUsersFromAdmin', subcription_controller_1.getAllUsersFromAdmin);
router.post('/addUser', subcription_controller_1.addUser);
/**
 * @swagger
 * /admin/users/name:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get  User Names
 *     tags: [ Admin - Users ]
 *     parameters:
 *     - name: pageCount
 *       in: query
 *     - name: pageLimit
 *       in: query
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/name', deliveryMan_controller_1.getUserNames);
/**
 * @swagger
 * /admin/users/withdraw-history:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get  Users Withdraw History
 *     tags: [ Admin - Users ]
 *     parameters:
 *     - name: transactionStatus
 *       in: query
 *       schema:
 *        $ref: "#/components/schemas/UserWithdrawList"
 *     - name: pageCount
 *       in: query
 *     - name: pageLimit
 *       in: query
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/withdraw-history', deliveryMan_controller_1.getUserWithdrawHistory);
exports.default = router;
