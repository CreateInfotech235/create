"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const city_controller_1 = require("../../controller/admin/city.controller");
const country_controller_1 = require("../../controller/admin/country.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /admin/country/create:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Create Country
 *     tags: [ Admin - Country ]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateCountry"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/create', country_controller_1.createCountry);
/**
 * @swagger
 * /admin/country/{countryId}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Update Country
 *     tags: [ Admin - Country ]
 *     parameters:
 *     - name: countryId
 *       in: path
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateCountry"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/:countryId', country_controller_1.updateCountry);
/**
 * @swagger
 * /admin/country:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Countries
 *     tags: [ Admin - Country ]
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
router.get('/', country_controller_1.getCountries);
/**
 * @swagger
 * /admin/country/names:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Country Names
 *     tags: [ Admin - Country ]
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
router.get('/names', city_controller_1.getCountryNames);
/**
 * @swagger
 * /admin/country/deleteCountry/{countryId}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete Country
 *     tags: [ Admin - Country ]
 *     parameters:
 *     - name: countryId
 *       in: path
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/deleteCountry/:countryId', country_controller_1.deleteCountry);
exports.default = router;
