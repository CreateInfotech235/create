import express from 'express';
import { getBilling, BillingApprove } from '../../controller/mobile/Billing.controller';


const router = express.Router();
// get billing
router.get('/getBilling', getBilling);

// approve billing
router.post('/approveBilling', BillingApprove);

export default router;
