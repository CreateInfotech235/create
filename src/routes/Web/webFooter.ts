import express from 'express';
import { getWebFooter, createWebFooter } from '../../controller/web/webFooter';
import adminAuth from '../../middleware/admin.auth';

const router = express.Router();

router.get('/', getWebFooter);


router.post('/create', createWebFooter);

export default router;
