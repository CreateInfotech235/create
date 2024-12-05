import express from 'express';
import {
  signUp,
  getDeliveryBoysForMerchant,
  getDeliveryManProfile,
  updateDeliveryManProfile,
  updateDeliveryManStatus,
  deleteDeliveryMan,
  moveToTrashDeliveryMan,
  updateDeliveryManProfileAndPassword,
} from '../../controller/deliveryBoy/auth.controller';
import {
  allPaymentInfo,
  OrderAssigneeSchemaData,
} from '../../controller/deliveryBoy/order.controller';

const router = express.Router();

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
router.post('/signUp', signUp);

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
router.get(
  '/getDeliveryBoysForMerchant/:merchantId',
  getDeliveryBoysForMerchant,
);

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
router.get('/getDeliveryManProfile/:id', getDeliveryManProfile);

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
router.patch(
  '/updateDeliveryManProfile/:id',
  updateDeliveryManProfileAndPassword,
);

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
router.patch('/updateDeliveryManStatus/:id', updateDeliveryManStatus);

export default router;
