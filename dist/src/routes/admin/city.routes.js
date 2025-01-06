"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const city_controller_1 = require("../../controller/admin/city.controller");
const router = (0, express_1.Router)();
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
router.post('/create', city_controller_1.createCity);
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
router.patch('/:cityId', city_controller_1.updateCity);
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
router.get('/', city_controller_1.getCities);
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
router.post('/day-charges/create', city_controller_1.createDayWiseCharges);
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
router.put('/day-charges/update', city_controller_1.updateDayWiseCharges);
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
router.get('/day-charges/:productChargeId', city_controller_1.getDayWiseChargesByCity);
/**
 * @swagger
 * /admin/city/deleteCity/{cityId}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete City
 *     tags: [ Admin - City ]
 *     parameters:
 *     - name: cityId
 *       in: path
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/deleteCity/:cityId', city_controller_1.deleteCity);
exports.default = router;
