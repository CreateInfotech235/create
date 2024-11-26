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
  deleteDeliveryMan
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
 * /admin/deliveryMan:
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
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/', getDeliveryMans);
router.get('/getAllDeliveryMans', getAllDeliveryMans);
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

router.post('/addDeliveryMan', addDeliveryMan);

router.delete('/deleteDeliveryMan/:deliveryManId', deleteDeliveryMan);

export default router;
