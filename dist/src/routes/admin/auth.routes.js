"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controller/admin/auth.controller");
const admin_auth_1 = __importDefault(require("../../middleware/admin.auth"));
/**
 * index.js
 * @description :: index route of platforms
 */
const router = express_1.default.Router();
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
router.post('/signIn', auth_controller_1.signIn);
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
router.post('/profileCredentialUpdate', admin_auth_1.default, auth_controller_1.profileCredentialUpdate);
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
router.post('/sendEmailOrMobileOtp', admin_auth_1.default, auth_controller_1.sendEmailOrMobileOtp);
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
router.post('/profileUpdate', admin_auth_1.default, auth_controller_1.profileUpdate);
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
router.post('/renewToken', auth_controller_1.renewToken);
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
router.patch('/logout', auth_controller_1.logout);
router.get('/count', admin_auth_1.default, auth_controller_1.getOrderCounts);
exports.default = router;
