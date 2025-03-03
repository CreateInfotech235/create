import express from 'express';
import { createWebSocialMedia, getWebSocialMedia } from '../../controller/web/webSocialMedia';
// import adminAuth from '../../middleware/admin.auth';

const router = express.Router();

router.get('/', getWebSocialMedia);

router.post('/create', createWebSocialMedia);

export default router;
