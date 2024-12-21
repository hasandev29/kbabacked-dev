import express from 'express';
import { verifyToken, authorizeRole } from '../middlewares/authMiddleware.js';
import { createStaff, createBulkStaff, getAllStaff, getStaffList, getStaffById, getStaffByStaffId, updateStaffDetails, updateStaffAddress, deleteStaff } from '../controllers/user/staff.controller.js';

const router = express.Router();

router.post('/', createStaff);

router.post('/bulk', createBulkStaff);

router.get('/', getAllStaff);

router.get('/list', getStaffList);

router.get('/:id', getStaffById);

router.get('/staffId/:staff_id', getStaffByStaffId);

router.patch('/:id', updateStaffDetails);

router.patch('/address/:staff_id', updateStaffAddress);

router.delete('/:id', deleteStaff);

// router.get('/:id', verifyToken, authorizeRole('staff'), getStaffById);


export default router;
