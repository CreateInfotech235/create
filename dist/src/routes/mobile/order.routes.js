"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../../controller/mobile/order.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /mobile/order/create:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Order Creation From Mobile
 *     tags: [ Mobile - Orders ]
 *     requestBody:
 *      description: for creating order
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderCreateType'
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/create', order_controller_1.orderCreation);
/**
 * @swagger
 * /mobile/order/updateOrder/{orderId}:
 *   patch:
 *     summary: Update Order
 *     tags: [ Mobile - Orders ]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderUpdateType'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/updateOrder/:orderId', order_controller_1.orderUpdate);
/**
 * @swagger
 * /mobile/order/getAllPaymentInfo:
 *   get:
 *     summary: Get All Payment Info
 *     tags: [ Mobile - Orders ]
 *     responses:
 *       200:
 *         description: Payment info retrieved successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllPaymentInfo', order_controller_1.getAllPaymentInfo);
/**
 * @swagger
 * /mobile/order/cancel:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Cancel Order
 *     tags: [ Mobile - Orders ]
 *     requestBody:
 *      description: for order cancellation
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              orderId:
 *                type: number
 *              reason:
 *                type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/cancel', order_controller_1.cancelOrder);
/**
 * @swagger
 * /mobile/order/getAllOrdersFromMerchant/{id}:
 *   get:
 *     summary: Get All Orders From Merchant
 *     tags: [ Mobile - Orders ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllOrdersFromMerchant/:id', order_controller_1.getAllOrdersFromMerchant);
/**
 * @swagger
 * /mobile/order/getAllRecentOrdersFromMerchant/{id}:
 *   get:
 *     summary: Get All Recent Orders From Merchant
 *     tags: [ Mobile - Orders ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllOrdersFromMerchantMulti/:id', order_controller_1.getAllOrdersFromMerchantMulti);
/**
 * @swagger
 * /mobile/order/getAllOrdersFromMerchantMulti:
 *   get:
 *     summary: Get All Orders From Merchant Multi
 *     tags: [ Mobile - Orders ]
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 *
 */
router.get('/getAllRecentOrdersFromMerchant/:id', order_controller_1.getAllRecentOrdersFromMerchant);
/**
 * @swagger
 * /mobile/order/deleteOrderFormMerchant/{id}:
 *   delete:
 *     summary: Delete Order From Merchant
 *     tags: [ Mobile - Orders ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/deleteOrderFormMerchant/:id', order_controller_1.deleteOrderFormMerchant);
router.delete('/deleteOrderFormMerchantMulti/:id', order_controller_1.deleteOrderFormMerchantMulti);
/**
 * @swagger
 * /mobile/order/moveToTrashFormMerchant/{id}:
 *   patch:
 *     summary: Move To Trash From Merchant
 *     tags: [ Mobile - Orders ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order moved to trash successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/moveToTrashFormMerchant/:id', order_controller_1.moveToTrash);
router.patch('/moveToTrashFormMerchantMulti/:id', order_controller_1.moveToTrashMulti);
router.patch('/moveToTrashSubOrderMulti/:id', order_controller_1.moveToTrashSubOrderMulti);
router.get('/getAllRecentOrdersFromMerchant', order_controller_1.getAllRecentOrdersFromMerchant);
router.post('/createMulti', order_controller_1.orderCreationMulti);
router.patch('/orderUpdateMulti/:orderId', order_controller_1.orderUpdateMulti);
exports.default = router;
