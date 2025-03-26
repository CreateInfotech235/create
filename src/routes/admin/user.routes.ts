import { Router } from 'express';
import {
  getUserNames,
  getUserWithdrawHistory,
} from '../../controller/admin/deliveryMan.controller';
import { getUsers, getAllUsers, getAllUsersFromAdmin, addUser, updateProfileOfMerchant, deleteMerchant, updateStatus } from '../../controller/admin/subcription.controller';

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

/**
 * @swagger
 * /admin/users/getAllUsers:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get All Users
 *     tags: [ Admin - Users ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllUsers', getAllUsers);

/**
 * @swagger
 * /admin/users/getAllUsersFromAdmin:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get All Users From Admin
 *     tags: [ Admin - Users ]
 *     parameters:
 *     - name: existss
 *       in: query
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllUsersFromAdmin', getAllUsersFromAdmin);

/**
 * @swagger
 * /admin/users/addUser:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Add User
 *     tags: [ Admin - Users ]
 *     requestBody:
 *      description: Add User
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              contactNumber:
 *                type: number
 *              address:
 *                type: object
 *                properties:
 *                  street:
 *                    type: string
 *                  city:
 *                    type: string
 *                  postalCode:
 *                    type: string
 *                  country:
 *                    type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
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

/**
 * @swagger
 * /admin/users/updateProfileOfMerchant/{id}:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Update Profile Of Merchant
 *     tags: [ Admin - Users ]
 *     parameters:
 *     - name: id
 *       in: path
 *     requestBody:
 *       description: Update Profile Of Merchant
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            email:
 *              type: string
 *            contactNumber:
 *              type: number
 *            countryCode:
 *              type: string
 *            image:
 *              type: string
 *            address:
 *              type: object
 *              properties:
 *                street:
 *                  type: string
 *                city:
 *                  type: string
 *                postalCode:
 *                  type: string
 *                country:
 *                  type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/updateProfileOfMerchant/:id', updateProfileOfMerchant);

/**
 * @swagger
 * /admin/users/deleteMerchant/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete Merchant
 *     tags: [ Admin - Users ]
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
router.delete('/deleteMerchant/:id', deleteMerchant);



router.post('/updateStatus/:id', updateStatus);



export default router;
