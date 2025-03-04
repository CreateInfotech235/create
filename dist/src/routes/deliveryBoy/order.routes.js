"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../../controller/deliveryBoy/order.controller");
const router = express_1.default.Router();
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
router.get('/', order_controller_1.getAssignedOrders);
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
router.get('/getAssignedOrdersMulti', order_controller_1.getAssignedOrdersMulti);
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
router.patch('/accept', order_controller_1.acceptOrder);
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
router.patch('/arrive', order_controller_1.arriveOrder);
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
router.patch('/arriveOrderMulti', order_controller_1.arriveOrderMulti);
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
router.patch('/cancel', order_controller_1.cancelOrder);
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
router.patch('/cancelMultiOrder', order_controller_1.cancelMultiOrder);
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
router.patch('/cancelMultiSubOrder', order_controller_1.cancelMultiSubOrder);
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
router.patch('/pickUp', order_controller_1.pickUpOrder);
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
router.patch('/pickUpOrderMulti', order_controller_1.pickUpOrderMulti);
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
router.patch('/depart', order_controller_1.departOrder);
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
router.patch('/departOrderMulti', order_controller_1.departOrderMulti);
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
router.patch('/deliver', order_controller_1.deliverOrder);
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
router.patch('/deliverOrderMulti', order_controller_1.deliverOrderMulti);
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
router.post('/sendEmailOrMobileOtp', order_controller_1.sendEmailOrMobileOtp);
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
router.post('/sendEmailOrMobileOtpMulti', order_controller_1.sendEmailOrMobileOtpMulti);
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
router.post('/sendEmailOrMobileOtpMultiForDelivery', order_controller_1.sendEmailOrMobileOtpMultiForDelivery);
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
router.get('/getOrderById/:orderId', order_controller_1.getOrderById);
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
router.get('/getOrderForDeliveryMan', order_controller_1.getOederForDeliveryMan);
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
router.get('/getCancelledOrder', order_controller_1.getAllCancelledOrders);
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
router.get('/getCancelledOrderMulti', order_controller_1.getAllCancelledOrdersMulti);
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
router.get('/getPaymentData', order_controller_1.getPaymentDataForDeliveryBoy);
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
router.get('/getMultiOrder', order_controller_1.getMultiOrder);
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
router.get('/getMultiOrderById/:id', order_controller_1.getMultiOrderById);
// get sub order data
router.get('/getSubOrderData/:id', order_controller_1.getSubOrderData);
router.patch('/logoutdeliveryboy', order_controller_1.logoutdeliveryboy);
exports.default = router;
