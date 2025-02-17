import express from 'express';
import customerRoutes from './auth.routes';

const router = express.Router();

router.use('/auth', customerRoutes);

export default router;
