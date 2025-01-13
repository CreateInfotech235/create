import express from 'express';
import mobileAuth from '../../middleware/mobile.auth';
import authRoutes from './auth.routes';
import orderRoutes from './order.routes';
import subscriptionRoutes from './subscription.routes';
import invoiceRoutes from './invoice.routes';
import parcelTypeRoutes from './parcelType.routes';
const router = express.Router();

router.use('/auth', authRoutes);
router.use(mobileAuth);
router.use('/order', orderRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/invoice', invoiceRoutes);
router.use('/parcelType', parcelTypeRoutes);
export default router;
