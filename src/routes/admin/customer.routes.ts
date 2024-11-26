import { Router } from 'express';
import { addCustomer } from '../../controller/admin/customer.controller';

const router = Router();

router.post('/addCustomer', addCustomer);

export default router;
