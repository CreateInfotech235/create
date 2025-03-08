import express from 'express';
import {
  cancelOrder,
  orderCreation,
  getAllOrdersFromMerchant,
  deleteOrderFormMerchant,
  moveToTrash,
  orderUpdate,
  getAllRecentOrdersFromMerchant,
  getAllPaymentInfo,
  orderCreationMulti,
  orderUpdateMulti,
  getAllOrdersFromMerchantMulti,
  deleteOrderFormMerchantMulti,
  moveToTrashMulti,
  moveToTrashSubOrderMulti,
  reassignOrder,
  moveToTrashMultiOrderarray,
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
router.patch('/updateOrder/:orderId', orderUpdate);

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
router.get('/getAllPaymentInfo', getAllPaymentInfo);

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
router.get('/getAllOrdersFromMerchant/:id', getAllOrdersFromMerchant);

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

router.get('/getAllOrdersFromMerchantMulti/:id', getAllOrdersFromMerchantMulti);
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

router.get(
  '/getAllRecentOrdersFromMerchant/:id',
  getAllRecentOrdersFromMerchant,
);

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
router.delete('/deleteOrderFormMerchant/:id', deleteOrderFormMerchant);



router.delete('/deleteOrderFormMerchantMulti/:id', deleteOrderFormMerchantMulti);
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
router.patch('/moveToTrashFormMerchant/:id', moveToTrash);


router.patch('/moveToTrashFormMerchantMulti/:id', moveToTrashMulti);
router.patch('/moveToTrashSubOrderMulti/:id', moveToTrashSubOrderMulti);

router.patch('/moveToTrashMultiOrder', moveToTrashMultiOrderarray);


router.get('/getAllRecentOrdersFromMerchant', getAllRecentOrdersFromMerchant);
router.post('/createMulti', orderCreationMulti);
router.patch('/orderUpdateMulti/:orderId', orderUpdateMulti);

router.patch('/reassignOrder', reassignOrder);

export default router;
