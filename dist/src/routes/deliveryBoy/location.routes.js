"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controller/deliveryBoy/auth.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /deliveryBoy/location/update:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update Location
 *     tags: [ Delivery Boy - Location ]
 *     requestBody:
 *      description: for update location
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/DeliveryManUpdateLocation"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/update', auth_controller_1.updateLocation);
exports.default = router;
