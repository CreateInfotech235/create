import express from 'express';
import homeRoutes from './webHome';
import pricingRoutes from './webPricing';
import footerRoutes from './webFooter';
import navbarRoutes from './webNavbar';

const router = express.Router();

router.use('/home', homeRoutes);
router.use('/pricing', pricingRoutes);
router.use('/footer', footerRoutes);


router.use('/navbar', navbarRoutes);


export default router;
