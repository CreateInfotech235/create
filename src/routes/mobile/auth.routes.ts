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
} from '../../controller/mobile/auth.controller';
import multer from 'multer';
import {
  deleteDeliveryMan,
  moveToTrashDeliveryMan,
} from '../../controller/deliveryBoy/auth.controller';

/**
 * index.js
 * @description :: index route of platforms
 */

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
router.post('/signIn', signIn);

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
router.get('/getLocationOfMerchant', getLocationOfMerchant);
router.get('/getProfileOfMerchant/:id', getProfileOfMerchant);
router.post('/updateProfileOfMerchant/:id', updateProfileOfMerchant);
router.get('/count/:id', getOrderCounts);
router.get('/getAllDeliveryManOfMerchant/:id', getAllDeliveryManOfMerchant);
router.get('/getorderHistory', getorderHistory);

router.delete('/deleteDeliveryMan/:id', deleteDeliveryMan);
router.patch('/moveToTrashDeliveryMan/:id', moveToTrashDeliveryMan);

export default router;
