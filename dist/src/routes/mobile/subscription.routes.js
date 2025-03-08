"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("../../controller/mobile/subscription.controller");
const router = express_1.default.Router();
// /**
//  * @swagger
//  * /mobile/subscription/getApproveSubscription/{id}:
//  *   get:
//  *     summary: Get Approve Subscription
//  *     tags: [ Mobile - Subscription ]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Subscription approved successfully
//  *       400:
//  *         description: Bad Request Client Error
//  *       500:
//  *         description: Something went wrong
//  */
router.get('/getApproveSubscription/:id', subscription_controller_1.getApproveSubscription);
// /**
//  * @swagger
//  * /mobile/subscription/create-payment-intent:
//  *   post:
//  *     summary: Create Payment Intent
//  *     tags: [ Mobile - Subscription ]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/SubscriptionType'
//  *     responses:
//  *       200:
//  *         description: Payment intent created successfully
//  *       400:
//  *         description: Bad Request Client Error
//  *       500:
//  *         description: Something went wrong
//  */
router.post('/create-payment-intent', subscription_controller_1.stripPayment);
// switch subscription plan
router.post('/switch-subscription-plan', subscription_controller_1.switchSubscriptionPlan);
exports.default = router;
