"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicle_controller_1 = require("../../controller/admin/vehicle.controller");
const router = express_1.default.Router();
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
router.post('/create', vehicle_controller_1.createVehicle);
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
router.patch('/:vehicleId', vehicle_controller_1.updateVehicle);
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
router.delete('/:vehicleId', vehicle_controller_1.deleteVehicle);
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
router.get('/', vehicle_controller_1.getVehicles);
router.get('/getVehicalForAll', vehicle_controller_1.getVehiclesForAll);
exports.default = router;
