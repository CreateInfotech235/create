import express from 'express';
import {
  cancelOrder,
  orderCreation,
  getAllOrdersFromMerchant,
  deleteOrderFormMerchant,
  moveToTrash,
  orderUpdate,
  getAllRecentOrdersFromMerchant,
  // getAllOrdersFromMerchantt,
} from '../../controller/mobile/order.controller';

const router = express.Router();

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
router.post('/create', orderCreation);
router.patch('/updateOrder/:orderId', orderUpdate);

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
router.patch('/cancel', cancelOrder);

router.get('/getAllOrdersFromMerchant/:id', getAllOrdersFromMerchant);
router.get(
  '/getAllRecentOrdersFromMerchant/:id',
  getAllRecentOrdersFromMerchant,
);
router.delete('/deleteOrderFormMerchant/:id', deleteOrderFormMerchant);
router.patch('/moveToTrashFormMerchant/:id', moveToTrash);

export default router;
