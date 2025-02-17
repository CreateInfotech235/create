import express from 'express';
import { sendNotification } from '../../controller/Notificationinapp/Notificationinapp';

const router = express.Router();

router.post('/sendNotification', sendNotification);

export default router;
