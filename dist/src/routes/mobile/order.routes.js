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
router.patch('/updateOrder/:orderId', order_controller_1.orderUpdate);
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
router.get('/getAllOrdersFromMerchant/:id', order_controller_1.getAllOrdersFromMerchant);
router.get('/getAllRecentOrdersFromMerchant/:id', order_controller_1.getAllRecentOrdersFromMerchant);
router.delete('/deleteOrderFormMerchant/:id', order_controller_1.deleteOrderFormMerchant);
router.patch('/moveToTrashFormMerchant/:id', order_controller_1.moveToTrash);
exports.default = router;
