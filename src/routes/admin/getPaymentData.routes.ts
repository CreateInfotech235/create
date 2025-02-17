import express from 'express';
import { getPaymentData, getPaymentTotal } from '../../controller/admin/getPaymentData.controller';
import adminAuth from '../../middleware/admin.auth';

const router = express.Router();

router.get('/getPaymentData', adminAuth, getPaymentData);
router.get('/gettotalPayment' , getPaymentTotal)

export default router;