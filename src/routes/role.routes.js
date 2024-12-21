import express from 'express';
import { createRole, bulkCreateRoles, getAllRoles, getRoleById, updateRole, deleteRole } from '../controllers/roles.controller.js';
import { verifyToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createRole);
router.post('/bulk', bulkCreateRoles);
router.get('/', getAllRoles);
router.get('/:id', getRoleById);
router.patch('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;