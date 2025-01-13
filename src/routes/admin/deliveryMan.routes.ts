import { Router } from 'express';
import {
  getDeliveryManDocuments,
  getDeliveryManInfo,
  getDeliveryManLocations,
  getDeliveryManNames,
  getDeliveryManOrders,
  getDeliveryManProfileById,
  getDeliveryMans,
  getAllDeliveryMans,
  getAllDeliveryMansFromAdmin,
  getDeliveryManWalletHistory,
  updateVerificationStatus,
  addDeliveryMan,
  deleteDeliveryMan,
  updateDeliveryManProfileAndPassword,
  getDeliveryManLocation,
} from '../../controller/admin/deliveryMan.controller';

const router = Router();

/**
 * @swagger
 * /admin/deliveryMan/updateVerificationStatus:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Update Verification Status
 *     tags: [ Admin - Delivery Man ]
 *     requestBody:
 *      description: Update verification status
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateDeliveryMan"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/updateVerificationStatus', updateVerificationStatus);

/**
 * @swagger
 * /admin/deliveryMan/documents:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Delivery Man Documents
 *     tags: [ Admin - Delivery Man ]
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
router.get('/documents', getDeliveryManDocuments);

/**
 * @swagger
 * /admin/deliveryMan/locations:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Delivery Man Locations
 *     tags: [ Admin - Delivery Man ]
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
router.get('/locations', getDeliveryManLocations);

/**
 * @swagger
 * /admin/deliveryMan/deliveryMan:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Delivery Mans
 *     tags: [ Admin - Delivery Man ]
 *     parameters:
 *     - name: pageCount
 *       in: query
 *     - name: pageLimit
 *       in: query
 *     - name: searchValue
 *       in: query
 *     - name: isVerified
 *       in: query
 *     - name: createdByMerchant
 *       in: query
 *     - name: createdByAdmin
 *       in: query
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/', getDeliveryMans);

/**
 * @swagger
 * /admin/deliveryMan/getAllDeliveryMans:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Delivery Mans
 *     tags: [ Admin - Delivery Man ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllDeliveryMans', getAllDeliveryMans);

/**
 * @swagger
 * /admin/deliveryMan/getAllDeliveryMansFromAdmin:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Delivery Mans
 *     tags: [ Admin - Delivery Man ]
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/getAllDeliveryMansFromAdmin', getAllDeliveryMansFromAdmin);

/**
 * @swagger
 * /admin/deliveryMan/orders/{deliveryManId}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Delivery Man Orders
 *     tags: [ Admin - Delivery Man ]
 *     parameters:
 *     - name: deliveryManId
 *       in: path
 *     - name: pageCount
 *       in: query
 *     - name: pageLimit
 *       in: query
 *     - name: orderListType
 *       in: query
 *       schema:
 *        type: string
 *        enum:
 *        - PENDING
 *        - COMPLETED
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/orders/:deliveryManId', getDeliveryManOrders);

/**
 * @swagger
 * /admin/deliveryMan/assignInfo/{orderId}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Delivery Man Admin Assign Info
 *     tags: [ Admin - Delivery Man ]
 *     parameters:
 *     - name: orderId
 *       in: path
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
router.get('/assignInfo/:orderId', getDeliveryManInfo);

/**
 * @swagger
 * /admin/deliveryMan/names:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Delivery Man Names
 *     tags: [ Admin - Delivery Man ]
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
router.get('/names', getDeliveryManNames);

/**
 * @swagger
 * /admin/deliveryMan/{deliveryManId}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Delivery Man By Id
 *     tags: [ Admin - Delivery Man ]
 *     parameters:
 *     - name: deliveryManId
 *       in: path
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/:deliveryManId', getDeliveryManProfileById);

/**
 * @swagger
 * /admin/deliveryMan/wallet-history/{deliveryManId}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Delivery Man Names
 *     tags: [ Admin - Delivery Man ]
 *     parameters:
 *     - name: deliveryManId
 *       in: path
 *     - name: transactionType
 *       in: query
 *       schema:
 *        $ref: "#/components/schemas/DeliveryManWalletList"
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
router.get('/wallet-history/:deliveryManId', getDeliveryManWalletHistory);

/**
 * @swagger
 * /admin/deliveryMan/addDeliveryMan:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Add Delivery Man
 *     tags: [ Admin - Delivery Man ]
 *     requestBody:
 *      description: Add Delivery Man
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
 *                type: string
 *              postCode:
 *                type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/addDeliveryMan', addDeliveryMan);

/**
 * @swagger
 * /admin/deliveryMan/deleteDeliveryMan/{deliveryManId}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete Delivery Man
 *     tags: [ Admin - Delivery Man ]
 *     parameters:
 *     - name: deliveryManId
 *       in: path
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/deleteDeliveryMan/:deliveryManId', deleteDeliveryMan);

/**
 * @swagger
 * /admin/deliveryMan/updateDeliveryManProfile/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Update Delivery Man Profile
 *     tags: [ Admin - Delivery Man ]
 *     parameters:
 *     - name: id
 *       in: path
 *     requestBody:
 *      description: Update Delivery Man Profile
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
 *              contactNumber:
 *                type: number
 *              address:
 *                type: string
 *              postCode:
 *                type: string
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch(
  '/updateDeliveryManProfile/:id',
  updateDeliveryManProfileAndPassword,
);


router.get('/location/:deliveryManId' , getDeliveryManLocation)
export default router;
