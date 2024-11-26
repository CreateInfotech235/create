import { Router } from 'express';
import {
  getUserNames,
  getUserWithdrawHistory,
} from '../../controller/admin/deliveryMan.controller';
import { getUsers, getAllUsers, getAllUsersFromAdmin, addUser } from '../../controller/admin/subcription.controller';

const router = Router();

/**
 * @swagger
 * /admin/users:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Subscribed/ Unsubscribed  Users
 *     tags: [ Admin - Users ]
 *     parameters:
 *     - name: isSubscribed
 *       in: query
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
router.get('/', getUsers);
router.get('/getAllUsers', getAllUsers);
router.get('/getAllUsersFromAdmin', getAllUsersFromAdmin);
router.post('/addUser', addUser);
/**
 * @swagger
 * /admin/users/name:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get  User Names
 *     tags: [ Admin - Users ]
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
router.get('/name', getUserNames);

/**
 * @swagger
 * /admin/users/withdraw-history:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get  Users Withdraw History
 *     tags: [ Admin - Users ]
 *     parameters:
 *     - name: transactionStatus
 *       in: query
 *       schema:
 *        $ref: "#/components/schemas/UserWithdrawList"
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
router.get('/withdraw-history', getUserWithdrawHistory);

export default router;
