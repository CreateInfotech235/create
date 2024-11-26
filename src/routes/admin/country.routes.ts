import { Router } from 'express';
import { getCountryNames } from '../../controller/admin/city.controller';
import {
  createCountry,
  getCountries,
  updateCountry,
  deleteCountry
} from '../../controller/admin/country.controller';

const router = Router();

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
router.post('/create', createCountry);

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
router.patch('/:countryId', updateCountry);

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
router.get('/', getCountries);

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
router.get('/names', getCountryNames);
router.delete('/deleteCountry/:countryId', deleteCountry);

export default router;
