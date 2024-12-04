"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controller/deliveryBoy/auth.controller");
const order_controller_1 = require("../../controller/deliveryBoy/order.controller");
const router = express_1.default.Router();
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
router.post('/signUp', auth_controller_1.signUp);
router.get('/getDeliveryBoysForMerchant/:merchantId', auth_controller_1.getDeliveryBoysForMerchant);
router.get('/getDeliveryManProfile/:id', auth_controller_1.getDeliveryManProfile);
router.patch('/updateDeliveryManProfile/:id', auth_controller_1.updateDeliveryManProfileAndPassword);
// router.patch(
//   '/updateDeliveryManPassword/:id',
//   ,
// );
router.patch('/updateDeliveryManStatus/:id', auth_controller_1.updateDeliveryManStatus);
router.get('/all', order_controller_1.OrderAssigneeSchemaData);
router.get('/allPaymentInfo', order_controller_1.allPaymentInfo);
exports.default = router;
