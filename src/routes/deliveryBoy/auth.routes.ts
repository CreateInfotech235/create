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
 * /deliveryBoy/auth/signUp:
 *   post:
 *     summary: Sign Up
 *     tags: [ Delivery Boy - Auth ]
 *     requestBody:
 *      description: for sign up
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/DeliveryManSignUp"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/signUp', signUp);
router.get(
  '/getDeliveryBoysForMerchant/:merchantId',
  getDeliveryBoysForMerchant,
);
router.get('/getDeliveryManProfile/:id', getDeliveryManProfile);
router.patch(
  '/updateDeliveryManProfile/:id',
  updateDeliveryManProfileAndPassword,
);
// router.patch(
//   '/updateDeliveryManPassword/:id',
//   ,
// );
router.patch('/updateDeliveryManStatus/:id', updateDeliveryManStatus);

router.get('/all', OrderAssigneeSchemaData);
router.get('/allPaymentInfo', allPaymentInfo);

export default router;
