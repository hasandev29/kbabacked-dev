import express from 'express';

import { exportExcel } from '../middlewares/excel.middleware.js';
import { exportAllStudents, exportAdvancedSearchStudents } from '../controllers/user/students.controller.js';

const router = express.Router();

router.get('/students', exportAllStudents, exportExcel);

router.get('/students/advanced-search', exportAdvancedSearchStudents, exportExcel);

export default router;