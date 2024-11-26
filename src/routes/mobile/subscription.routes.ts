import express from 'express';

import { getApproveSubscription } from '../../controller/mobile/subscription.controller';

const router = express.Router();



router.get('/getApproveSubscription/:id' , getApproveSubscription)

export default router;
