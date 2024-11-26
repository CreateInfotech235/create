import express from 'express';
import { getOrderLocations } from '../../controller/admin/deliveryMan.controller';
import {
  assignOrder,
  getOrders,
  getAllOrders,
} from '../../controller/admin/order.controller';
import { orderCreation } from '../../controller/mobile/order.controller';

const router = express.Router();

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
router.post('/assign', assignOrder);

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
router.post('/create', orderCreation);

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
router.get('/', getOrders);
router.get('/getAllOrders', getAllOrders);

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
router.get('/location', getOrderLocations);

export default router;
