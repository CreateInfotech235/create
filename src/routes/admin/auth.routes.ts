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
} from '../../controller/admin/auth.controller';
import adminAuth from '../../middleware/admin.auth';

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

router.get('/getAllNotifications', adminAuth, getAllNotifications);
router.patch(
  '/markNotificationAsRead/:notificationId',
  adminAuth,
  markNotificationAsRead,
);
router.patch(
  '/markAllNotificationsAsRead',
  adminAuth,
  markAllNotificationsAsRead,
);
router.delete(
  '/deleteNotification/:notificationId',
  adminAuth,
  deleteNotification,
);
router.get(
  '/getUnreadNotificationCount',
  adminAuth,
  getUnreadNotificationCount,
);
router.get('/getAdminProfile', adminAuth, getAdminProfile);
router.get('/getAdminSupportTicket', adminAuth, getSupportTicket);
router.post('/Email' ,adminAuth, sendEmailFor)

router.get('/support-tickets', getAllTickets);

// Route: GET /api/support-tickets/:id/messages -> Fetch messages for a specific ticket
router.get('/support-tickets/:id/messages', getMessagesByTicketId);

// Route: POST /api/support-tickets/:id/messages -> Add a new message to a ticket
router.post('/support-tickets/:id/messages', addMessageToTicket);

router.delete(
  '/support-tickets/:ticketId/messages/:messageId',
  deleteMessageFromTicket
);


router.post('/forgot-password/send-otp', sendOtp);

router.post('/forgot-password/verify-otp', verifyOtp);

router.post('/forgot-password/reset-password', resetPassword);

export default router;
