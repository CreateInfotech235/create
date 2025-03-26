"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deliveryMan_controller_1 = require("../../controller/admin/deliveryMan.controller");
const order_controller_1 = require("../../controller/admin/order.controller");
const order_controller_2 = require("../../controller/mobile/order.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /admin/orders/assign:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Assign Order From Admin
 *     tags: [ Admin - Orders ]
 *     requestBody:
 *      description: assign order
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminAssignOrder"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/assign', order_controller_1.assignOrder);
/**
 * @swagger
 * /admin/orders/create:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Create Order From Admin
 *     tags: [ Admin - Orders ]
 *     requestBody:
 *      description: assign order
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/OrderCreateType"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/create', order_controller_2.orderCreation);
/**
 * @swagger
 * /admin/orders:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Orders
 *     tags: [ Admin - Orders ]
 *     parameters:
 *     - name: date
 *       in: query
 *     - name: status
 *       in: query
 *     - name: user
 *       in: query
 *     - name: deliveryMan
 *       in: query
 *     - name: orderId
 *       in: query
 *     - name: invoiceId
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
router.get('/', order_controller_1.getOrders);
/**
 * @swagger
 * /admin/orders/getAllOrders:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get All Orders
 *     tags: [ Admin - Orders ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllOrders', order_controller_1.getAllOrders);
/**
 * @swagger
 * /admin/orders/location:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Order Locations
 *     tags: [ Admin - Orders ]
 *     parameters:
 *     - name: status
 *       in: query
 *       required: false
 *       schema:
 *        $ref: "#/components/schemas/AdminOrderLocations"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/location', deliveryMan_controller_1.getOrderLocations);
router.get('/getAllOrdersFromMerchantMulti/:id', order_controller_1.getAllOrdersFromMerchantMulti);
exports.default = router;
