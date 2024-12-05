import { Router } from 'express';
import {
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
} from '../../controller/mobile/invoice.controller';

const router = Router();

router.post('/create', createInvoice);
router.get('/:merchantId', getInvoice);
router.put('/update/:merchantId', updateInvoice);
router.delete('/delete/:merchantId', deleteInvoice);

export default router;
