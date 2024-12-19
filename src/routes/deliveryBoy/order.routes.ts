import express from 'express';
import {
  acceptOrder,
  arriveOrder,
  cancelOrder,
  deliverOrder,
  departOrder,
  getAllCancelledOrders,
  getAssignedOrders,
  getOederForDeliveryMan,
  getOrderById,
  pickUpOrder,
  sendEmailOrMobileOtp,
} from '../../controller/deliveryBoy/order.controller';

const router = express.Router();

/**
 * @swagger
 * /deliveryBoy/orders:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     parameters:
 *     - name: status
 *       in: query
 *       description: for listing orders
 *
 *       schema:
 *        $ref: '#components/schemas/OrderListType'
 *     - name: pageCount
 *       in: query
 *       required: true
 *     - name: pageLimit
 *       in: query
 *       required: true
 *     - name: startDate
 *       in: query
 *     - name: endDate
 *       in: query
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/', getAssignedOrders);

/**
 * @swagger
 * /deliveryBoy/orders/accept:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     requestBody:
 *       description: Extra parameters
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#components/schemas/OrderDeliveryAccept'
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/accept', acceptOrder);

/**
 * @swagger
 * /deliveryBoy/orders/arrive:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     requestBody:
 *       description: Extra parameters
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#components/schemas/OrderDelivery'
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/arrive', arriveOrder);
/**
 * @swagger
 * /deliveryBoy/orders/cancel:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     requestBody:
 *       description: Extra parameters
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#components/schemas/OrderDelivery'
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
 * /deliveryBoy/orders/pickUp:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     requestBody:
 *       description: Extra parameters
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#components/schemas/OrderPickUpType'
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/pickUp', pickUpOrder);

/**
 * @swagger
 * /deliveryBoy/orders/depart:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     requestBody:
 *       description: Extra parameters
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#components/schemas/OrderArriveType'
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/depart', departOrder);

/**
 * @swagger
 * /deliveryBoy/orders/deliver:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     requestBody:
 *       description: Extra parameters
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#components/schemas/OrderDeliveryType'
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/deliver', deliverOrder);

/**
 * @swagger
 * /deliveryBoy/orders/sendEmailOrMobileOtp:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     requestBody:
 *       description: for otp at pickup or delivery location
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#components/schemas/OrderIdType'
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/sendEmailOrMobileOtp', sendEmailOrMobileOtp);
router.get('/getOrderById/:orderId', getOrderById);
router.get('/getOrderForDeliveryMan', getOederForDeliveryMan);

router.get('/getCancelledOrder', getAllCancelledOrders);


export default router;
