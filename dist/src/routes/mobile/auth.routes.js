"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controller/mobile/auth.controller");
const auth_controller_2 = require("../../controller/deliveryBoy/auth.controller");
const auth_controller_3 = require("../../controller/deliveryBoy/auth.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /mobile/auth/signUp:
 *   post:
 *     summary: Sign Up
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *      description: for sign up
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/MobileSignUp"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/signUp', auth_controller_1.signUp);
/**
 * @swagger
 * /mobile/auth/signIn:
 *   post:
 *     summary: Sign In
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *      description: for sign in
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/MobileSignIn"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/signIn', auth_controller_1.signIn);
/**
 * @swagger
 * /mobile/auth/activatePlan:
 *   post:
 *     summary: Activate Free Subscription
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *      description: free subscription activation call
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *              medicalCertificateNumber:
 *                type: number
 *              medicalCertificate:
 *                type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/activatePlan', auth_controller_1.activateFreeSubcription);
/**
 * @swagger
 * /mobile/auth/sendEmailOrMobileOtp:
 *   post:
 *     summary: Email Or Mobile Verification Otp
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *      description: for send email or mobile verification otp
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/MobileOtpVerify"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/sendEmailOrMobileOtp', auth_controller_1.sendEmailOrMobileOtp);
/**
 * @swagger
 * /mobile/auth/renewToken:
 *   post:
 *     summary: Renew New Auth Tokens
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *      description: for renew auth tokens because older expired
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/MobileRenewToken"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/renewToken', auth_controller_1.renewToken);
/**
 * @swagger
 * /mobile/auth/logout:
 *   patch:
 *     summary: Logout
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *      description: logout from app
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/MobileRenewToken"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/logout', auth_controller_1.logout);
/**
 * @swagger
 * /mobile/auth/getLocationOfMerchant:
 *   get:
 *     summary: Get Merchant Location
 *     tags: [ Mobile - Auth ]
 *     responses:
 *       200:
 *         description: Successfully retrieved merchant location
 *       500:
 *         description: Something went wrong
 */
router.get('/getLocationOfMerchant', auth_controller_1.getLocationOfMerchant);
/**
 * @swagger
 * /mobile/auth/getProfileOfMerchant/{id}:
 *   get:
 *     summary: Get Merchant Profile
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved merchant profile
 *       404:
 *         description: Merchant not found
 *       500:
 *         description: Something went wrong
 */
router.get('/getProfileOfMerchant/:id', auth_controller_1.getProfileOfMerchant);
/**
 * @swagger
 * /mobile/auth/updateProfileOfMerchant/{id}:
 *   post:
 *     summary: Update Merchant Profile
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Merchant not found
 *       500:
 *         description: Something went wrong
 */
router.post('/updateProfileOfMerchant/:id', auth_controller_1.updateProfileOfMerchant);
/**
 * @swagger
 * /mobile/auth/count/{id}:
 *   get:
 *     summary: Get Order Counts
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved order counts
 *       500:
 *         description: Something went wrong
 */
router.get('/count/:id', auth_controller_1.getOrderCounts);
/**
 * @swagger
 * /mobile/auth/getAllDeliveryManOfMerchant/{id}:
 *   get:
 *     summary: Get All Delivery Men of Merchant
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved delivery men
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllDeliveryManOfMerchant/:id', auth_controller_1.getAllDeliveryManOfMerchant);
/**
 * @swagger
 * /mobile/auth/getorderHistory:
 *   get:
 *     summary: Get Order History
 *     tags: [ Mobile - Auth ]
 *     responses:
 *       200:
 *         description: Successfully retrieved order history
 *       500:
 *         description: Something went wrong
 */
router.get('/getorderHistory', auth_controller_1.getorderHistory);
/**
 * @swagger
 * /mobile/auth/deleteDeliveryMan/{id}:
 *   delete:
 *     summary: Delete Delivery Man
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery man deleted successfully
 *       404:
 *         description: Delivery man not found
 *       500:
 *         description: Something went wrong
 */
router.delete('/deleteDeliveryMan/:id', auth_controller_3.deleteDeliveryMan);
/**
 * @swagger
 * /mobile/auth/getDeliveryManLocations/{id}:
 *   get:
 *     summary: Get Delivery Man Locations
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved locations
 *       500:
 *         description: Something went wrong
 */
router.get('/getDeliveryManLocations/:id', auth_controller_1.getDeliveryManLocations);
/**
 * @swagger
 * /mobile/auth/moveToTrashDeliveryMan/{id}:
 *   patch:
 *     summary: Move Delivery Man to Trash
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully moved to trash
 *       404:
 *         description: Delivery man not found
 *       500:
 *         description: Something went wrong
 */
router.patch('/moveToTrashDeliveryMan/:id', auth_controller_3.moveToTrashDeliveryMan);
// /**
//  * @swagger
//  * /mobile/auth/updateDeliveryManProfile/{id}:
//  *   patch:
//  *     summary: Update Delivery Man Profile
//  *     tags: [ Mobile - Auth ]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               firstName:
//  *                 type: string
//  *               lastName:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               phone:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Profile updated successfully
//  *       404:
//  *         description: Delivery man not found
//  *       500:
//  *         description: Something went wrong
//  */
router.patch('/updateDeliveryManProfile/:id', auth_controller_1.updateDeliveryManProfileAndPassword);
/**
 * @swagger
 * /mobile/auth/getOrderCountsbyDate/{id}:
 *   get:
 *     summary: Get Order Counts by Date
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved order counts
 *       500:
 *         description: Something went wrong
 */
router.get('/getOrderCountsbyDate/:id', auth_controller_1.getOrderCountsbyDate);
/**
 * @swagger
 * /mobile/auth/admindata:
 *   get:
 *     summary: Get Admin Data
 *     tags: [ Mobile - Auth ]
 *     responses:
 *       200:
 *         description: Successfully retrieved admin data
 *       500:
 *         description: Something went wrong
 */
router.get('/admindata', auth_controller_1.getadmindata);
/**
 * @swagger
 * /mobile/auth/postSupportTicket/{id}:
 *   post:
 *     summary: Create Support Ticket
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket created successfully
 *       500:
 *         description: Something went wrong
 */
router.post('/postSupportTicket/:id', auth_controller_1.postSupportTicket);
/**
 * @swagger
 * /mobile/auth/getSupportTicket/{id}:
 *   get:
 *     summary: Get Support Tickets
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved tickets
 *       500:
 *         description: Something went wrong
 */
router.get('/getSupportTicket/:id', auth_controller_1.getSupportTicket);
/**
 * @swagger
 * /mobile/auth/deleteSupportTicket/{ticketId}:
 *   delete:
 *     summary: Delete Support Ticket
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Something went wrong
 */
router.delete('/deleteSupportTicket/:ticketId', auth_controller_1.deleteSupportTicket);
// /**
//  * @swagger
//  * /mobile/auth/getAllNotifications/{id}:
//  *   get:
//  *     summary: Get All Notifications
//  *     tags: [ Mobile - Auth ]
//  */
router.get('/getAllNotifications/:id', auth_controller_1.getAllNotifications);
// /**
//  * @swagger
//  * /mobile/auth/markNotificationAsRead/{id}/{notificationId}:
//  *   patch:
//  *     summary: Mark a notification as read
//  *     tags: [ Mobile - Auth ]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *       - in: path
//  *         name: notificationId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Notification marked as read successfully
//  *       404:
//  *         description: Notification not found
//  *       500:
//  *         description: Something went wrong
//  */
router.patch('/markNotificationAsRead/:id/:notificationId', auth_controller_1.markNotificationAsRead);
// /**
//  * @swagger
//  * /mobile/auth/markAllNotificationsAsRead/{id}:
//  *   patch:
//  *     summary: Mark all notifications as read
//  *     tags: [ Mobile - Auth ]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: All notifications marked as read
//  *       500:
//  *         description: Something went wrong
//  */
router.patch('/markAllNotificationsAsRead/:id', auth_controller_1.markAllNotificationsAsRead);
// /**
//  * @swagger
//  * /mobile/auth/deleteNotification/{id}/{notificationId}:
//  *   delete:
//  *     summary: Delete a notification
//  *     tags: [ Mobile - Auth ]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *       - in: path
//  *         name: notificationId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Notification deleted successfully
//  *       404:
//  *         description: Notification not found
//  *       500:
//  *         description: Something went wrong
//  */
router.delete('/deleteNotification/:id/:notificationId', auth_controller_1.deleteNotification);
router.delete('/deleteAllNotifications/:id', auth_controller_1.deleteAllNotifications);
// /**
//  * @swagger
//  * /mobile/auth/getUnreadNotificationCount/{id}:
//  *   get:
//  *     summary: Get count of unread notifications
//  *     tags: [ Mobile - Auth ]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Unread notification count retrieved successfully
//  *       500:
//  *         description: Something went wrong
//  */
router.get('/getUnreadNotificationCount/:id', auth_controller_1.getUnreadNotificationCount);
/**
 * @swagger
 * /mobile/auth/getAllDeliveryMans:
 *   get:
 *     summary: Get All Delivery Mans
 *     tags: [ Mobile - Auth ]
 *     responses:
 *       200:
 *         description: Successfully retrieved delivery men
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllDeliveryMans', auth_controller_1.getAllDeliveryMans);
/**
 * @swagger
 * /mobile/auth/subscriptions:
 *   get:
 *     summary: Get Subscriptions
 *     tags: [ Mobile - Auth ]
 *     responses:
 *       200:
 *         description: Successfully retrieved subscriptions
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/subscriptions', auth_controller_1.getSubscriptions);
/**
 * @swagger
 * /mobile/auth/SupportTicketUpdate:
 *   patch:
 *     summary: Update Support Ticket
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/SupportTicketUpdate', auth_controller_1.SupportTicketUpdate);
/**
 * @swagger
 * /mobile/auth/support-tickets:
 *   get:
 *     summary: Get All Tickets
 *     tags: [ Mobile - Auth ]
 *     responses:
 *       200:
 *         description: Successfully retrieved tickets
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/support-tickets', auth_controller_1.getAllTickets);
/**
 * @swagger
 * /mobile/auth/support-tickets/:id/messages:
 *   get:
 *     summary: Fetch messages for a specific ticket
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved messages
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/support-tickets/:id/messages', auth_controller_1.getMessagesByTicketId);
/**
 * @swagger
 * /mobile/auth/support-tickets/:id/messages:
 *   post:
 *     summary: Add a new message to a ticket
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               sender:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message added successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/support-tickets/:id/messages', auth_controller_1.addMessageToTicket);
router.patch('/support-tickets/:supportTicketId/messages/:messageId', auth_controller_1.Messageupdate);
router.patch('/support-tickets/:supportTicketId/messages', auth_controller_1.Messageread);
router.delete('/support-tickets/:supportTicketId/messages/:messageId', auth_controller_1.MessageDelete);
router.get('/unreadMessages/:userId', auth_controller_1.getunreadMessages);
/**
 * @swagger
 * /mobile/auth/support-tickets/:ticketId/messages/:messageId:
 *   delete:
 *     summary: Delete a message from a ticket
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/support-tickets/:ticketId/messages/:messageId', auth_controller_1.deleteMessageFromTicket);
/**
 * @swagger
 * /mobile/auth/distance:
 *   post:
 *     summary: Get Distance
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               apiKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved distance
 *       500:
 *         description: Something went wrong
 */
router.post('/distance', auth_controller_1.getDistance);
/**
 * @swagger
 * /mobile/auth/forgot-password/send-otp:
 *   post:
 *     summary: Send OTP for Forgot Password
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       500:
 *         description: Something went wrong
 */
router.post('/forgot-password/send-otp', auth_controller_1.sendOtp);
/**
 * @swagger
 * /mobile/auth/forgot-password/verify-otp:
 *   post:
 *     summary: Verify OTP for Forgot Password
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/forgot-password/verify-otp', auth_controller_1.verifyOtp);
/**
 * @swagger
 * /mobile/auth/forgot-password/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/forgot-password/reset-password', auth_controller_1.resetPassword);
/**
 * @swagger
 * /mobile/auth/location/:merchantId:
 *   get:
 *     summary: Get Delivery Man Location
 *     tags: [ Mobile - Auth ]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: deliveryManId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved delivery man location
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/location/:merchantId', auth_controller_3.getDeliveryManLocation);
router.get('/getApproveSubscription/:id', auth_controller_2.getApproveSubscription);
router.post('/create-payment-intent', auth_controller_2.stripPayment);
router.get('/getMapApi', auth_controller_2.getMapApi);
exports.default = router;
