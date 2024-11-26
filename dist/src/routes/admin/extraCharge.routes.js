"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const extraCharges_controller_1 = require("../../controller/admin/extraCharges.controller");
const router = express_1.default.Router();
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
router.post('/create', extraCharges_controller_1.createExtraCharges);
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
router.patch('/:extraChargeId', extraCharges_controller_1.updateExtraCharges);
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
router.delete('/:extraChargeId', extraCharges_controller_1.deleteExtraCharge);
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
router.get('/', extraCharges_controller_1.getExtraCharges);
exports.default = router;
