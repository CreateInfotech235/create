import express from 'express';
import { createWebhomelandingpage, getWebLandingPage } from '../../controller/web/webhome';
import adminAuth from '../../middleware/admin.auth';

const router = express.Router();

// router.get('/', getWebLandingpage);
router.post('/landingpage',createWebhomelandingpage);
router.get('/landingpage',getWebLandingPage);
export default router;
