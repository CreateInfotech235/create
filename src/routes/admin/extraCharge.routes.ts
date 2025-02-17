import express from 'express';
import {
  createExtraCharges,
  deleteExtraCharge,
  getExtraCharges,
  updateExtraCharges,
} from '../../controller/admin/extraCharges.controller';

const router = express.Router();

/**
 * @swagger
 * /admin/extraCharge/create:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Create Document
 *     tags: [ Admin - extraCharges ]
 *     requestBody:
 *      description: create extraCharge
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateExtraCharge"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/create', createExtraCharges);

/**
 * @swagger
 * /admin/extraCharge/{extraChargeId}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Update extraCharge
 *     tags: [ Admin - extraCharges ]
 *     parameters:
 *     - name: extraChargeId
 *       in: path
 *     requestBody:
 *      description: update extraCharge
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateExtraCharge"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/:extraChargeId', updateExtraCharges);

/**
 * @swagger
 * /admin/extraCharge/{extraChargeId}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete extraCharge
 *     tags: [ Admin - extraCharges ]
 *     parameters:
 *     - name: extraChargeId
 *       in: path
 *     requestBody:
 *       description: delete extraCharge
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
router.delete('/:extraChargeId', deleteExtraCharge);

/**
 * @swagger
 * /admin/extraCharge:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get extraCharges
 *     tags: [ Admin - extraCharges ]
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
router.get('/', getExtraCharges);

export default router;
