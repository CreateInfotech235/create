import express from 'express';
import homeRoutes from './webHome';
import pricingRoutes from './webPricing';
import footerRoutes from './webFooter';

const router = express.Router();

router.use('/home', homeRoutes);
router.use('/pricing', pricingRoutes);
router.use('/footer', footerRoutes);


export default router;
