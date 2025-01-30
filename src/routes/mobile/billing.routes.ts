import express from 'express';
import { getBilling } from '../../controller/mobile/Billing.controller';


const router = express.Router();
// get billing
router.get('/getBilling', getBilling);

export default router;
