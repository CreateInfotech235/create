import express from 'express';
import {
  activateFreeSubcription,
  logout,
  renewToken,
  sendEmailOrMobileOtp,
  signIn,
  signUp,
  getLocationOfMerchant,
  getProfileOfMerchant,
  getAllDeliveryManOfMerchant,
  updateProfileOfMerchant,
  getOrderCounts,
  getorderHistory,
  getDeliveryManLocations,
  updateDeliveryManProfileAndPassword,
  getOrderCountsbyDate,
  getadmindata,
  postSupportTicket,
  getSupportTicket,
  deleteSupportTicket,
  getAllNotifications,
  getUnreadNotificationCount,
  deleteNotification,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  getAllDeliveryMans,
  getSubscriptions,
  SupportTicketUpdate,
  getAllTickets,
  getMessagesByTicketId,
  addMessageToTicket,
  deleteMessageFromTicket,
  getDistance,
  sendOtp,
  verifyOtp,
  resetPassword,
  deleteAllNotifications,
} from '../../controller/mobile/auth.controller';
import { getApproveSubscription } from '../../controller/deliveryBoy/auth.controller';
import multer from 'multer';
import {
  deleteDeliveryMan,
  getDeliveryManLocation,
  moveToTrashDeliveryMan,
} from '../../controller/deliveryBoy/auth.controller';

const router = express.Router();

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
router.post('/signUp', signUp);

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
router.post('/signIn', signIn);

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
router.post('/activatePlan', activateFreeSubcription);

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
router.post('/sendEmailOrMobileOtp', sendEmailOrMobileOtp);

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
router.post('/renewToken', renewToken);

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
router.patch('/logout', logout);

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
router.get('/getLocationOfMerchant', getLocationOfMerchant);

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
router.get('/getProfileOfMerchant/:id', getProfileOfMerchant);

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
router.post('/updateProfileOfMerchant/:id', updateProfileOfMerchant);

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
router.get('/count/:id', getOrderCounts);

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
router.get('/getAllDeliveryManOfMerchant/:id', getAllDeliveryManOfMerchant);

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
router.get('/getorderHistory', getorderHistory);

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
router.delete('/deleteDeliveryMan/:id', deleteDeliveryMan);

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
router.get('/getDeliveryManLocations/:id', getDeliveryManLocations);

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
router.patch('/moveToTrashDeliveryMan/:id', moveToTrashDeliveryMan);

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
router.patch(
  '/updateDeliveryManProfile/:id',
  updateDeliveryManProfileAndPassword,
);

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
router.get('/getOrderCountsbyDate/:id', getOrderCountsbyDate);

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
router.get('/admindata', getadmindata);

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
router.post('/postSupportTicket/:id', postSupportTicket);

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
router.get('/getSupportTicket/:id', getSupportTicket);

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
router.delete('/deleteSupportTicket/:ticketId', deleteSupportTicket);

// /**
//  * @swagger
//  * /mobile/auth/getAllNotifications/{id}:
//  *   get:
//  *     summary: Get All Notifications
//  *     tags: [ Mobile - Auth ]
//  */
router.get('/getAllNotifications/:id', getAllNotifications);
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
router.patch(
  '/markNotificationAsRead/:id/:notificationId',
  markNotificationAsRead,
);

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
router.patch('/markAllNotificationsAsRead/:id', markAllNotificationsAsRead);

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
router.delete('/deleteNotification/:id/:notificationId', deleteNotification);



router.delete('/deleteAllNotifications/:id', deleteAllNotifications);

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
router.get('/getUnreadNotificationCount/:id', getUnreadNotificationCount);

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
router.get('/getAllDeliveryMans', getAllDeliveryMans);

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
router.get('/subscriptions', getSubscriptions);

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
router.patch('/SupportTicketUpdate', SupportTicketUpdate);

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
router.get('/support-tickets', getAllTickets);

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
router.get('/support-tickets/:id/messages', getMessagesByTicketId);

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
router.post('/support-tickets/:id/messages', addMessageToTicket);

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
router.delete(
  '/support-tickets/:ticketId/messages/:messageId',
  deleteMessageFromTicket,
);

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
router.post('/distance', getDistance);

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
router.post('/forgot-password/send-otp', sendOtp);

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
router.post('/forgot-password/verify-otp', verifyOtp);

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
router.post('/forgot-password/reset-password', resetPassword);

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
router.get('/location/:merchantId', getDeliveryManLocation);

router.get('/getApproveSubscription/:id', getApproveSubscription);

export default router;
