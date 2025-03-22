import express from 'express';
import { getBilling } from '../../controller/admin/Billing.controller';

const router = express.Router();

router.get('/getBilling', getBilling);

export default router;