import express from 'express';
import { sendGmail } from '../controllers/mailController.js';

const router = express.Router();

router.post('/gmail', sendGmail);

export default router;
