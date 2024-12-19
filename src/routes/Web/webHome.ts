import express from 'express';
import { getWebHome, updateWebHome, createWebHome } from '../../controller/web/webhome';
import adminAuth from '../../middleware/admin.auth';

const router = express.Router();

router.get('/', getWebHome);

router.patch('/update', adminAuth, updateWebHome);

router.post('/create', adminAuth, createWebHome);

export default router;
