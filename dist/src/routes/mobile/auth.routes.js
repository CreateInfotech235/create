"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controller/mobile/auth.controller");
const auth_controller_2 = require("../../controller/deliveryBoy/auth.controller");
/**
 * index.js
 * @description :: index route of platforms
 */
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
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });
// router.post('/signUp', upload.single('medicalCertificate'), signUp);
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
 *     summary: Activate Free Subcription
 *     tags: [ Mobile - Auth ]
 *     requestBody:
 *      description: free subcription activation call
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
router.get('/getLocationOfMerchant', auth_controller_1.getLocationOfMerchant);
router.get('/getProfileOfMerchant/:id', auth_controller_1.getProfileOfMerchant);
router.post('/updateProfileOfMerchant/:id', auth_controller_1.updateProfileOfMerchant);
router.get('/count/:id', auth_controller_1.getOrderCounts);
router.get('/getAllDeliveryManOfMerchant/:id', auth_controller_1.getAllDeliveryManOfMerchant);
router.get('/getorderHistory', auth_controller_1.getorderHistory);
router.delete('/deleteDeliveryMan/:id', auth_controller_2.deleteDeliveryMan);
router.patch('/moveToTrashDeliveryMan/:id', auth_controller_2.moveToTrashDeliveryMan);
exports.default = router;
