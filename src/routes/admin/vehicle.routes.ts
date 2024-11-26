import express from 'express';
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
  getVehiclesForAll
} from '../../controller/admin/vehicle.controller';

const router = express.Router();

/**
 * @swagger
 * /admin/vehicle/create:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Create Document
 *     tags: [ Admin - Vehicles ]
 *     requestBody:
 *      description: create vehicle
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateVehicle"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/create', createVehicle);

/**
 * @swagger
 * /admin/vehicle/{vehicleId}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Update Vehicle
 *     tags: [ Admin - Vehicles ]
 *     parameters:
 *     - name: vehicleId
 *       in: path
 *     requestBody:
 *      description: update vehicle
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateVehicle"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/:vehicleId', updateVehicle);

/**
 * @swagger
 * /admin/vehicle/{vehicleId}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete Vehicle
 *     tags: [ Admin - Vehicles ]
 *     parameters:
 *     - name: vehicleId
 *       in: path
 *     requestBody:
 *       description: delete vehicle
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
router.delete('/:vehicleId', deleteVehicle);

/**
 * @swagger
 * /admin/vehicle:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Vehicles
 *     tags: [ Admin - Vehicles ]
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
router.get('/', getVehicles);
router.get('/getVehicalForAll', getVehiclesForAll);

export default router;
