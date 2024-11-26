import express from 'express';
import { updateLocation } from '../../controller/deliveryBoy/auth.controller';

const router = express.Router();

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
router.patch('/update', updateLocation);

export default router;
