import express from 'express';
import { getWebFooter, updateWebFooter, createWebFooter } from '../../controller/web/webFooter';
import adminAuth from '../../middleware/admin.auth';

const router = express.Router();

router.get('/', getWebFooter);

router.patch('/update', adminAuth, updateWebFooter);

router.post('/create', adminAuth, createWebFooter);

export default router;
