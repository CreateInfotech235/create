import express from 'express';
import adminRoutes from './admin';
import deliveryBoyRoutes from './deliveryBoy';
import mobileRoutes from './mobile';
import customerRoutes from './customer';
import webRoutes from './Web/index';
// import trRoutes from './tr/no';
const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/deliveryBoy', deliveryBoyRoutes);
router.use('/mobile', mobileRoutes);
router.use('/customer', customerRoutes);
router.use('/web', webRoutes);
// router.use('/tr', trRoutes);
export default router;
