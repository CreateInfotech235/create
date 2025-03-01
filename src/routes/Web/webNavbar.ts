import express from 'express';
import { getWebNavbar, createWebNavbar } from '../../controller/web/webNavbar';
// import adminAuth from '../../middleware/admin.auth';

const router = express.Router();

router.get('/', getWebNavbar);

router.post('/create', createWebNavbar);

export default router;
