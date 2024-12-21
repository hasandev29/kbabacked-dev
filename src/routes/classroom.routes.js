import express from 'express';
import { createClassroom, createBulkClassrooms, getAllClassrooms, getClassroomList, getClassroomById, updateClassroom, deleteClassroom } from '../controllers/academic/classroom.controller.js';

const router = express.Router();

router.post('/', createClassroom);

router.post('/bulk', createBulkClassrooms);

router.get('/', getAllClassrooms);

router.get('/list', getClassroomList);

router.get('/:id', getClassroomById);

router.patch('/:id', updateClassroom);

router.delete('/:id', deleteClassroom);

export default router;