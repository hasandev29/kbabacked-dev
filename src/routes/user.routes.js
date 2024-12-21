import express from 'express';

const router = express.Router();

import { getAllUsers, getUser, getUserByUserId, updateUser } from '../controllers/user/users.controller.js';

router.get('/', getAllUsers);

router.get('/:id', getUser);

router.get('/userId/:userId', getUserByUserId);

router.patch('/:id', updateUser);

export default router;