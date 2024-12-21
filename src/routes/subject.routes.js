import express from 'express';
import { createSubject, createBulkSubjects, getAllSubjects, getSubjectById, updateSubject, deleteSubject } from '../controllers/academic/subject.controller.js';

const router = express.Router();

router.post('/', createSubject);

router.post('/bulk', createBulkSubjects);

router.get('/', getAllSubjects);

router.get('/:id', getSubjectById);

router.patch('/:id', updateSubject);

router.delete('/:id', deleteSubject);

export default router;