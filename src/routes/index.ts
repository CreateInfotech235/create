import express from 'express';
import adminRoutes from './admin';
import deliveryBoyRoutes from './deliveryBoy';
import mobileRoutes from './mobile';
import customerRoutes from './customer';

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/deliveryBoy', deliveryBoyRoutes);
router.use('/mobile', mobileRoutes);
router.use('/customer', customerRoutes);

export default router;
