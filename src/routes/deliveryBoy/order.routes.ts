import express from 'express';
import {
  acceptOrder,
  arriveOrder,
  arriveOrderMulti,
  cancelOrder,
  deliverOrder,
  deliverOrderMulti,
  departOrder,
  departOrderMulti,
  getAllCancelledOrders,
  getAssignedOrders,
  getAssignedOrdersMulti,
  getOederForDeliveryMan,
  getOrderById,
  getPaymentDataForDeliveryBoy,
  getMultiOrder,
  pickUpOrder,
  pickUpOrderMulti,
  sendEmailOrMobileOtp,
  sendEmailOrMobileOtpMulti,
  sendEmailOrMobileOtpMultiForDelivery,
  getMultiOrderById,
  cancelMultiOrder,
  getAllCancelledOrdersMulti,
  cancelMultiSubOrder,
  logoutdeliveryboy,
  getSubOrderData,
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
 * /deliveryBoy/orders/getAssignedOrdersMulti:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Assigned Orders Multi
 *     tags: [ Delivery Man - Orders ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 * 
 */
router.get('/getAssignedOrdersMulti', getAssignedOrdersMulti);

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
 * /deliveryBoy/orders/arriveOrderMulti:
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
router.patch('/arriveOrderMulti', arriveOrderMulti);
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
 * /deliveryBoy/orders/cancelMultiOrder:
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

router.patch('/cancelMultiOrder', cancelMultiOrder);

/**
 * @swagger
 * /deliveryBoy/orders/cancelMultiSubOrder:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Cancel Multi Sub Order
 *     tags: [ Delivery Man - Orders ]
 *     requestBody:
 *       description: Extra parameters
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#components/schemas/OrderCancelType'
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/cancelMultiSubOrder', cancelMultiSubOrder);

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
  * /deliveryBoy/orders/pickUpOrderMulti:
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

router.patch('/pickUpOrderMulti', pickUpOrderMulti);

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
 * /deliveryBoy/orders/departOrderMulti:
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
router.patch('/departOrderMulti', departOrderMulti);

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
 * /deliveryBoy/orders/deliverOrderMulti:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/deliverOrderMulti', deliverOrderMulti);

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

/**
 * @swagger
 * /deliveryBoy/orders/sendEmailOrMobileOtpMulti:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/sendEmailOrMobileOtpMulti', sendEmailOrMobileOtpMulti);

/**
 * @swagger
 * /deliveryBoy/orders/sendEmailOrMobileOtpMultiForDelivery:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Orders List For Mobile
 *     tags: [ Delivery Man - Orders ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post(
  '/sendEmailOrMobileOtpMultiForDelivery',
  sendEmailOrMobileOtpMultiForDelivery,
);

/**
 * @swagger
 * /deliveryBoy/orders/getOrderById/{orderId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Order By Id
 *     tags: [ Delivery Man - Orders ]
 *     parameters:
 *     - name: orderId
 *       in: path
 *       required: true
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getOrderById/:orderId', getOrderById);

/**
 * @swagger
 * /deliveryBoy/orders/getOrderForDeliveryMan:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Order For Delivery Man
 *     tags: [ Delivery Man - Orders ]
 *     parameters:
 *     - name: startDate
 *       in: query
 *     - name: endDate
 *       in: query
 *     - name: status
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
router.get('/getOrderForDeliveryMan', getOederForDeliveryMan);

/**
 * @swagger
 * /deliveryBoy/orders/getCancelledOrder:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Cancelled Order
 *     tags: [ Delivery Man - Orders ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getCancelledOrder', getAllCancelledOrders);
/**
 * @swagger
 * /deliveryBoy/orders/getPaymentData:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Payment Data
 *     tags: [ Delivery Man - Orders ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
// router.get('/getCancelledOrderMulti', getAllCancelledOrdersMulti);

router.get('/getCancelledOrderMulti', getAllCancelledOrdersMulti);

/**
 * @swagger
 * /deliveryBoy/orders/getPaymentData:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Payment Data
 *     tags: [ Delivery Man - Orders ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */



router.get('/getPaymentData', getPaymentDataForDeliveryBoy);

/**
 * @swagger
 * /deliveryBoy/orders/getMultiOrder:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Multi Order
 *     tags: [ Delivery Man - Orders ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getMultiOrder', getMultiOrder);

/**
 * @swagger
 * /deliveryBoy/orders/getMultiOrderById/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Multi Order By Id
 *     tags: [ Delivery Man - Orders ]
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getMultiOrderById/:id', getMultiOrderById);
// get sub order data
router.get('/getSubOrderData/:id', getSubOrderData);

router.patch('/logoutdeliveryboy', logoutdeliveryboy);

export default router;








