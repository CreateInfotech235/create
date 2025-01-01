import express from 'express';

import { getApproveSubscription, stripPayment } from '../../controller/mobile/subscription.controller';

const router = express.Router();



router.get('/getApproveSubscription/:id' , getApproveSubscription)
router.post('/create-payment-intent' , stripPayment)

export default router;
