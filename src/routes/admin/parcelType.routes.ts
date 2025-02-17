import express from 'express';
import {
  createParcelTypes,
  deleteParcelType,
  getParcelTypes,
  updateParcelTypes,
} from '../../controller/admin/parcelType.controller';

const router = express.Router();

/**
 * @swagger
 * /admin/parcelType/create:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Create Document
 *     tags: [ Admin - parcelTypes ]
 *     requestBody:
 *      description: create parcelType
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateParcelType"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/create', createParcelTypes);

/**
 * @swagger
 * /admin/parcelType/{parcelTypeId}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Update parcelType
 *     tags: [ Admin - parcelTypes ]
 *     parameters:
 *     - name: parcelTypeId
 *       in: path
 *     requestBody:
 *      description: update parcelType
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateParcelType"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/:parcelTypeId', updateParcelTypes);

/**
 * @swagger
 * /admin/parcelType/{parcelTypeId}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete parcelType
 *     tags: [ Admin - parcelTypes ]
 *     parameters:
 *     - name: parcelTypeId
 *       in: path
 *     requestBody:
 *       description: delete parcelType
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/schemas/AdminDeleteVehicle'
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/:parcelTypeId', deleteParcelType);

/**
 * @swagger
 * /admin/parcelType:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get parcelTypes
 *     tags: [ Admin - parcelTypes ]
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
router.get('/', getParcelTypes);

export default router;
