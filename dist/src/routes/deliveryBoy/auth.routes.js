"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controller/deliveryBoy/auth.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryManSignUp:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         contactNumber:
 *           type: string
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - contactNumber
 *
 * /deliveryBoy/auth/signUp:
 *   post:
 *     summary: Sign Up
 *     tags: [ Delivery Boy - Auth ]
 *     requestBody:
 *       description: for sign up
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryManSignUp'
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
 * /deliveryBoy/auth/getDeliveryBoysForMerchant/{merchantId}:
 *   get:
 *     summary: Get delivery boys for a merchant
 *     tags: [ Delivery Boy - Auth ]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved delivery boys
 *       500:
 *         description: Something went wrong
 */
router.get('/getDeliveryBoysForMerchant/:merchantId', auth_controller_1.getDeliveryBoysForMerchant);
/**
 * @swagger
 * /deliveryBoy/auth/getDeliveryManProfile/{id}:
 *   get:
 *     summary: Get delivery man profile
 *     tags: [ Delivery Boy - Auth ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Something went wrong
 */
router.get('/getDeliveryManProfile/:id', auth_controller_1.getDeliveryManProfile);
/**
 * @swagger
 * /deliveryBoy/auth/updateDeliveryManProfile/{id}:
 *   patch:
 *     summary: Update delivery man profile and password
 *     tags: [ Delivery Boy - Auth ]
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
 *               mobileNumber:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     documentId:
 *                       type: string
 *                     image:
 *                       type: string
 *                     documentNumber:
 *                       type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request - Invalid input or password mismatch
 *       404:
 *         description: User not found
 *       500:
 *         description: Something went wrong
 */
router.patch('/updateDeliveryManProfile/:id', auth_controller_1.updateDeliveryManProfileAndPassword);
/**
 * @swagger
 * /deliveryBoy/auth/updateDeliveryManStatus/{id}:
 *   patch:
 *     summary: Update delivery man status
 *     tags: [ Delivery Boy - Auth ]
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
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Something went wrong
 */
router.patch('/updateDeliveryManStatus/:id', auth_controller_1.updateDeliveryManStatus);
/**
 * @swagger
 * /deliveryBoy/auth/forgot-password/send-otp:
 *   post:
 *     summary: Send OTP for forgot password
 *     tags: [ Delivery Boy - Auth ]
 *     requestBody:
 *       description: Send OTP for forgot password
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
 *       400:
 *         description: Bad request
 *       500:
 *         description: Something went wrong
 */
router.post('/forgot-password/send-otp', auth_controller_1.sendOtp);
/**
 * @swagger
 * /deliveryBoy/auth/forgot-password/verify-otp:
 *   post:
 *     summary: Verify OTP for forgot password
 *     tags: [ Delivery Boy - Auth ]
 *     requestBody:
 *       description: Verify OTP for forgot password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Something went wrong
 */
router.post('/forgot-password/verify-otp', auth_controller_1.verifyOtp);
/**
 * @swagger
 * /deliveryBoy/auth/forgot-password/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [ Delivery Boy - Auth ]
 *     requestBody:
 *       description: Reset password
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
 *         description: Bad request
 *       500:
 *         description: Something went wrong
 */
router.post('/forgot-password/reset-password', auth_controller_1.resetPassword);
exports.default = router;
