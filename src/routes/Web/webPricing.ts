import express from 'express';
import { getWebPricing, updateWebPricing, createWebPricing } from '../../controller/web/webPricing';
import adminAuth from '../../middleware/admin.auth';

const router = express.Router();

router.get('/', getWebPricing);

router.put('/update', adminAuth, updateWebPricing);

router.post('/create', adminAuth, createWebPricing);

export default router;
