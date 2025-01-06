"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subcription_controller_1 = require("../../controller/admin/subcription.controller");
const router = express_1.default.Router();
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
router.post('/manage', subcription_controller_1.manageSubscriptions);
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
router.get('/Approve', subcription_controller_1.getApproveSubscription);
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
router.get('/', subcription_controller_1.getSubscriptions);
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
router.get('/pending', subcription_controller_1.getPendingSubscription);
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
router.patch('/status', subcription_controller_1.acceptSubscription);
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
router.delete('/removeSubscription/:id', subcription_controller_1.deleteSubscription);
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
router.delete('/deletePurchaseSubscription/:id', subcription_controller_1.deletePurchaseSubscription);
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
router.get('/getexportFreeSubscription', subcription_controller_1.exportFreeSubscription);
exports.default = router;
