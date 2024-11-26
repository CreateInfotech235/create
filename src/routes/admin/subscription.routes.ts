import express from 'express';
import {
  acceptSubscription,
  deletePurchaseSubscription,
  deleteSubscription,
  getApproveSubscription,
  getPendingSubscription,
  getSubscriptions,
  manageSubscriptions,
} from '../../controller/admin/subcription.controller';

const router = express.Router();

/**
 * @swagger
 * /admin/subscriptions/manage:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Manage Subscription
 *     tags: [ Admin - Subscriptions ]
 *     requestBody:
 *      description: manage subscriptions
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminManageSubscription"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/manage', manageSubscriptions);
router.get('/Approve', getApproveSubscription);

/**
 * @swagger
 * /admin/subscriptions:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Subscriptions
 *     tags: [ Admin - Subscriptions ]
 *     parameters:
 *     - name: pageCount
 *       in: query
 *     - name: pageLimit
 *       in: query
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/', getSubscriptions);

/**
 * @swagger
 * /admin/subscriptions/pending:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Pending Subscriptions
 *     tags: [ Admin - Subscriptions ]
 *     parameters:
 *     - name: pageCount
 *       in: query
 *     - name: pageLimit
 *       in: query
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/pending', getPendingSubscription);

/**
 * @swagger
 * /admin/subscriptions/status:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Update Subscription Approve Or Reject
 *     tags: [ Admin - Subscriptions ]
 *     requestBody:
 *      description: approval/ reject subscription purchase
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminAcceptSubscription"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/status', acceptSubscription);
router.delete('/removeSubscription/:id', deleteSubscription);
router.delete('/deletePurchaseSubscription/:id', deletePurchaseSubscription);

export default router;
