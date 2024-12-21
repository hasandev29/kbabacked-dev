import express from 'express';
import { getReport, searchStudents } from '../controllers/reports.controller.js';

const router = express.Router();

router.get('/', getReport);

router.post('/search', searchStudents);

export default router;