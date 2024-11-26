import { Router } from 'express';
import {
  createCity,
  createDayWiseCharges,
  getCities,
  getDayWiseChargesByCity,
  updateCity,
  updateDayWiseCharges,
  deleteCity
} from '../../controller/admin/city.controller';

const router = Router();

/**
 * @swagger
 * /admin/city/create:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Create City
 *     tags: [ Admin - City ]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateCity"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/create', createCity);

/**
 * @swagger
 * /admin/city/{cityId}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Update City
 *     tags: [ Admin - City ]
 *     parameters:
 *     - name: cityId
 *       in: path
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateCity"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/:cityId', updateCity);

/**
 * @swagger
 * /admin/city:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Update City
 *     tags: [ Admin - City ]
 *     parameters:
 *     - name: cityName
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
router.get('/', getCities);

/**
 * @swagger
 * /admin/city/day-charges/create:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Create Day Wise Charges
 *     tags: [ Admin - City ]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateDayCharges"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/day-charges/create', createDayWiseCharges);

/**
 * @swagger
 * /admin/city/day-charges/update:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     summary: Update Day Wise Charges
 *     tags: [ Admin - City ]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminUpdateDayCharges"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.put('/day-charges/update', updateDayWiseCharges);

/**
 * @swagger
 * /admin/city/day-charges/{productChargeId}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Day Wise Charges
 *     tags: [ Admin - City ]
 *     parameters:
 *     - name: productChargeId
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
router.get('/day-charges/:productChargeId', getDayWiseChargesByCity);
router.delete('/deleteCity/:cityId', deleteCity);

export default router;
