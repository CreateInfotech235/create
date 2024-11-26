import express from 'express';
import adminAuth from '../../middleware/admin.auth';
import authRoutes from './auth.routes';
import cityRoutes from './city.routes';
import countryRoutes from './country.routes';
import customerRoutes from './customer.routes';
import deliveryManRoutes from './deliveryMan.routes';
import documentRoutes from './document.routes';
import extraChargeRoutes from './extraCharge.routes';
import orderRoutes from './order.routes';
import parcelTypeRoutes from './parcelType.routes';
import subscriptionRoutes from './subscription.routes';
import userRoutes from './user.routes';
import vehicleRoutes from './vehicle.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use(adminAuth);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/vehicle', vehicleRoutes);
router.use('/parcelType', parcelTypeRoutes);
router.use('/extraCharge', extraChargeRoutes);
router.use('/document', documentRoutes);
router.use('/customer', customerRoutes);
router.use('/deliveryMan', deliveryManRoutes);
router.use('/country', countryRoutes);
router.use('/city', cityRoutes);
router.use('/subscriptions', subscriptionRoutes);

export default router;
