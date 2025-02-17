import express from 'express';
import {
  acceptSubscription,
  deletePurchaseSubscription,
  deleteSubscription,
  exportFreeSubscription,
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

/**
 * @swagger
 * /admin/subscriptions/Approve:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Approve Subscription
 *     tags: [ Admin - Subscriptions ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
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

/**
 * @swagger
 * /admin/subscriptions/removeSubscription/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete Subscription
 *     tags: [ Admin - Subscriptions ]
 *     parameters:
 *     - name: id
 *       in: path
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/removeSubscription/:id', deleteSubscription);

/**
 * @swagger
 * /admin/subscriptions/deletePurchaseSubscription/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete Subscription
 *     tags: [ Admin - Subscriptions ]
 *     parameters:
 *     - name: id
 *       in: path
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/deletePurchaseSubscription/:id', deletePurchaseSubscription);

/**
 * @swagger
 * /admin/subscriptions/getexportFreeSubscription:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get export Free Subscription
 *     tags: [ Admin - Subscriptions ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getexportFreeSubscription', exportFreeSubscription);

export default router;
