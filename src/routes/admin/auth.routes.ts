import express from 'express';
import {
  logout,
  profileCredentialUpdate,
  profileUpdate,
  renewToken,
  sendEmailOrMobileOtp,
  signIn,
  getOrderCounts,
  getAllNotifications,
  getUnreadNotificationCount,
  deleteNotification,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  getAdminProfile,
  getSupportTicket,
  sendEmailFor,
  getAllTickets,
  getMessagesByTicketId,
  addMessageToTicket,
  deleteMessageFromTicket,
  sendOtp,
  verifyOtp,
  resetPassword,
  Messageupdate,
  Messageread,
  MessageDelete,
  getunreadMessages,
} from '../../controller/admin/auth.controller';
import adminAuth from '../../middleware/admin.auth';
import {
  deleteMapApi,
  getAllmapApi,
  getOneMapApi,
  mapApiCreate,
  updateMapApi,
} from '../../controller/admin/mapApi.controller';

/**
 * index.js
 * @description :: index route of platforms
 */

const router = express.Router();

/**
 * @swagger
 * /admin/auth/signIn:
 *   post:
 *     summary: Sign Up
 *     tags: [ Admin - Auth ]
 *     requestBody:
 *      description: for sign in
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: admin@gmail.com
 *              password:
 *                type: string
 *                example: Admin@123
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
 * /admin/auth/profileCredentialUpdate:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Profile Credential Update
 *     tags: [ Admin - Auth ]
 *     requestBody:
 *      description: profile credential update
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              adminId:
 *                type: string
 *              email:
 *                type: number
 *              contactNumber:
 *                type: string
 *              countryCode:
 *                type: string
 *              otp:
 *                type: number
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/profileCredentialUpdate', adminAuth, profileCredentialUpdate);

/**
 * @swagger
 * /admin/auth/sendEmailOrMobileOtp:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Email Or Mobile Verification Otp
 *     tags: [ Admin - Auth ]
 *     requestBody:
 *      description: for send email or mobile verification otp
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              contactNumber:
 *                type: number
 *              countryCode:
 *                type: string
 *              personType:
 *                type: string
 *                example: ADMIN
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/sendEmailOrMobileOtp', adminAuth, sendEmailOrMobileOtp);

/**
 * @swagger
 * /admin/auth/profileUpdate:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Profile Update
 *     tags: [ Admin - Auth ]
 *     requestBody:
 *      description: profile update
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              adminId:
 *                type: string
 *              name:
 *                type: string
 *              profileImage:
 *                type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/profileUpdate', adminAuth, profileUpdate);

/**
 * @swagger
 * /admin/auth/renewToken:
 *   post:
 *     summary: Renew New Auth Tokens
 *     tags: [ Admin - Auth ]
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
 * /admin/auth/logout:
 *   patch:
 *     summary: Logout
 *     tags: [ Admin - Auth ]
 *     requestBody:
 *      description: logout from admin
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
 * /admin/auth/count:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Order Counts
 *     tags: [ Admin - Auth ]
 *     description: Get Order Counts
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 *
 */
router.get('/count', adminAuth, getOrderCounts);
router.get('/count1', adminAuth, getOrderCounts);

/**
 * @swagger
 * /admin/auth/getAllNotifications:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get All Notifications
 *     tags: [ Admin - Auth ]
 *     description: Get All Notifications
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllNotifications', adminAuth, getAllNotifications);

/**
 * @swagger
 * /admin/auth/markNotificationAsRead/:notificationId:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Mark Notification As Read
 *     tags: [ Admin - Auth ]
 *     description: Mark Notification As Read
 *     parameters:
 *      - in: path
 *        name: notificationId
 *        required: true
 *        description: notificationId
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch(
  '/markNotificationAsRead/:notificationId',
  adminAuth,
  markNotificationAsRead,
);

/**
 * @swagger
 * /admin/auth/markAllNotificationsAsRead:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Mark All Notifications As Read
 *     tags: [ Admin - Auth ]
 *     description: Mark All Notifications As Read
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch(
  '/markAllNotificationsAsRead',
  adminAuth,
  markAllNotificationsAsRead,
);

/**
 * @swagger
 * /admin/auth/deleteNotification/:notificationId:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete Notification
 *     tags: [ Admin - Auth ]
 *     description: Delete Notification
 *     parameters:
 *      - in: path
 *        name: notificationId
 *        required: true
 *        description: notificationId
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete(
  '/deleteNotification/:notificationId',
  adminAuth,
  deleteNotification,
);

/**
 * @swagger
 * /admin/auth/getUnreadNotificationCount:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Unread Notification Count
 *     tags: [ Admin - Auth ]
 *     description: Get Unread Notification Count
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get(
  '/getUnreadNotificationCount',
  adminAuth,
  getUnreadNotificationCount,
);

/**
 * @swagger
 * /admin/auth/getAdminProfile:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Admin Profile
 *     tags: [ Admin - Auth ]
 *     description: Get Admin Profile
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAdminProfile', adminAuth, getAdminProfile);

/**
 * @swagger
 * /admin/auth/getAdminSupportTicket:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Admin Support Ticket
 *     tags: [ Admin - Auth ]
 *     description: Get Admin Support Ticket
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAdminSupportTicket', adminAuth, getSupportTicket);

/**
 * @swagger
 * /admin/auth/Email:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Email
 *     tags: [ Admin - Auth ]
 *     description: Email
 *     requestBody:
 *      description: email
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              contactNumber:
 *                type: number
 *              subject:
 *                type: string
 *              messageSend:
 *                type: string
 *              personType:
 *                type: string
 *                example: ADMIN
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/Email', adminAuth, sendEmailFor);

/**
 * @swagger
 * /admin/auth/support-tickets:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get All Tickets
 *     tags: [ Admin - Auth ]
 *     description: Get All Tickets
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/support-tickets', getAllTickets);

// Route: GET /api/support-tickets/:id/messages -> Fetch messages for a specific ticket
/**
 * @swagger
 * /admin/auth/support-tickets/{id}/messages:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Fetch messages for a specific ticket
 *     tags: [Admin - Auth]
 *     description: Fetch messages for a specific ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */

router.get('/support-tickets/:id/messages', getMessagesByTicketId);

/**
 * @swagger
 * /admin/auth/support-tickets/{id}/messages:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Add a new message to a ticket
 *     tags: [ Admin - Auth ]
 *     description: Add a new message to a ticket
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *      description: add message to ticket
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *              sender:
 *                type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/support-tickets/:id/messages', addMessageToTicket);

router.patch('/support-tickets/:supportTicketId/messages/:messageId', Messageupdate);


router.patch('/support-tickets/:supportTicketId/messages', Messageread);

router.delete('/support-tickets/:supportTicketId/messages/:messageId', MessageDelete);

router.get('/unreadMessages', getunreadMessages );


/**
 * @swagger
 * /admin/auth/support-tickets/{ticketId}/messages/{messageId}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete a message from a ticket
 *     tags: [ Admin - Auth ]
 *     description: Delete a message from a ticket
 *     parameters:
 *      - in: path
 *        name: ticketId
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: messageId
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
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
 * /admin/auth/forgot-password/send-otp:
 *   post:
 *     summary: Send OTP for Forgot Password
 *     tags: [ Admin - Auth ]
 *     description: Send OTP for Forgot Password
 *     requestBody:
 *      description: send otp for forgot password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/forgot-password/send-otp', sendOtp);

/**
 * @swagger
 * /admin/auth/forgot-password/verify-otp:
 *   post:
 *     summary: Verify OTP for Forgot Password
 *     tags: [ Admin - Auth ]
 *     description: Verify OTP for Forgot Password
 *     requestBody:
 *      description: verify otp for forgot password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              otp:
 *                type: number
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/forgot-password/verify-otp', verifyOtp);

/**
 * @swagger
 * /admin/auth/forgot-password/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags: [ Admin - Auth ]
 *     description: Reset Password
 *     requestBody:
 *      description: reset password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              newPassword:
 *                type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/forgot-password/reset-password', resetPassword);

/**
 * @swagger
 * /admin/auth/mapapi:
 *   post:
 *     summary: Map API Create
 *     tags: [ Admin - Auth ]
 *     description: Map API Create
 *     requestBody:
 *      description: map api create
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              mapKey:
 *                type: string
 *              status:
 *                type: boolean
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/mapapi', mapApiCreate);

/**
 * @swagger
 * /admin/auth/mapapi:
 *   get:
 *     summary: Get All Map API
 *     tags: [ Admin - Auth ]
 *     description: Get All Map API
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/mapapi', getAllmapApi);

/**
 * @swagger
 * /admin/auth/mapapi/{id}:
 *   get:
 *     summary: Get One Map API
 *     tags: [ Admin - Auth ]
 *     description: Get One Map API
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/mapapi/:id', getOneMapApi);

/**
 * @swagger
 * /admin/auth/mapapi/{id}:
 *   patch:
 *     summary: Update Map API
 *     tags: [ Admin - Auth ]
 *     description: Update Map API
 *     requestBody:
 *      description: update map api
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              mapKey:
 *                type: string
 *              status:
 *                type: boolean
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/mapapi', updateMapApi);

/**
 * @swagger
  * /admin/auth/mapapi/{id}:
 *   delete:
 *     summary: Delete Map API
 *     tags: [ Admin - Auth ]
 *     description: Delete Map API
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/mapapi/:id', deleteMapApi);
export default router;
