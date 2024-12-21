import express from 'express';
const router = express.Router();

import { verifyToken } from '../middlewares/authMiddleware.js';
import { registerUser, login, changePassword, forgotPassword, resetPassword } from '../controllers/auth.controller.js';


router.post('/login', login);

router.post('/register', registerUser);

router.post('/change-password', verifyToken, changePassword);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

export default router;