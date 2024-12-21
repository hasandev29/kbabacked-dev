import express from 'express';
import multer from 'multer';
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

import { extractDataFromExcel, exportExcel } from '../middlewares/excel.middleware.js';

import { exportStudentsToExcel, exportAllStudent, readStudentsFromExcel, importAndCreateStudents, readExcelFormulaValue, downloadExcel } from '../controllers/excel.controller.js';

router.get('/download', downloadExcel);

router.get('/students', exportStudentsToExcel);

router.get('/studentexport', exportAllStudent, exportExcel);

router.post('/read-excel', upload.single('file'),  readStudentsFromExcel);

router.post('/import', upload.single('file'), importAndCreateStudents);

router.post('/read-formula', upload.single('file'), readExcelFormulaValue);


export default router;