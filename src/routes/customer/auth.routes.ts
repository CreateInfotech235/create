import express from 'express';
import mobileAuth from '../../middleware/mobile.auth';
import {
  getCustomers,
  createCustomer,
  getCities,
  getCountries,
  deleteCustomerById,
  moveToTrashCustomer,
  updateCustomer,
} from '../../controller/customer/auth.controller';

const router = express.Router();

router.post('/signUp', createCustomer);
router.patch('/customerUpdate/:id', updateCustomer);
router.get('/getCustomers', getCustomers);
router.get('/getCities', getCities);
router.get('/getCountries', getCountries);
router.delete('/deleteCustomer/:id', deleteCustomerById);
router.patch('/moveToTrashCustomer/:id', moveToTrashCustomer);

export default router;
