import express from 'express';
import multer from 'multer';

import { createStudentsFromExcel } from '../controllers/user/students.controller.js';
import { createStaffFromExcel } from '../controllers/user/staff.controller.js';
import { extractDataFromExcel } from '../middlewares/excel.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/students', upload.single('file'), extractDataFromExcel, createStudentsFromExcel);

router.post('/staff', upload.single('file'), extractDataFromExcel, createStaffFromExcel);


export default router;