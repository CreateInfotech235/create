import { Router } from 'express';
import {
  addCustomer,
  deleteCustomerById,
  getAllCustomer,
  updateCustomer,
} from '../../controller/admin/customer.controller';

const router = Router();

// /**
//  * @swagger
//  * /admin/customer/addCustomer:
//  *   post:
//  *     security:
//  *      - bearerAuth: []
//  *     summary: Add Customer
//  *     tags: [ Admin - Customer ]
//  *     requestBody:
//  *      description: for add customer
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            type: object
//  *            properties:
//  *              name:
//  *                type: string
//  *              email:
//  *                type: string
//  *              contactNumber:
//  *                type: number
//  *              countryCode:
//  *                type: string
//  *              address:
//  *                type: string
//  *              city:
//  *                type: string
//  *              country:
//  *                type: string
//  *              pincode:
//  *                type: number
//  *     responses:
//  *       200:
//  *         description: Your request is successfully executed.
//  *       400:
//  *         description: Bad Request Client Error
//  *       500:
//  *         description: Something went wrong
//  */
router.post('/addCustomer', addCustomer);
router.get('/getAllCustomer', getAllCustomer);
router.patch('/customerUpdate/:id', updateCustomer);
router.delete('/deleteCustomer/:id', deleteCustomerById);
export default router;
