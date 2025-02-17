import express from 'express';
import deliveryManAuth from '../../middleware/deliveryMan.auth';
import authRoutes from './auth.routes';
import locationRoutes from './location.routes';
import orderRoutes from './order.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use(deliveryManAuth);
router.use('/orders', orderRoutes);
router.use('/location', locationRoutes);

export default router;
