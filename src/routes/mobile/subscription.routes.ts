import express from 'express';

import { getApproveSubscription, stripPayment, switchSubscriptionPlan } from '../../controller/mobile/subscription.controller';

const router = express.Router();

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
router.get('/getApproveSubscription/:id', getApproveSubscription);

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
router.post('/create-payment-intent', stripPayment);
// switch subscription plan
router.post('/switch-subscription-plan', switchSubscriptionPlan);
export default router;
