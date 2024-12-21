import express from 'express';

import { createCourse, getAllCourses, getCourse, getCourseList, updateCourse, deleteCourse } from '../controllers/academic/cource.controller.js';

const router = express.Router();

router.post('/', createCourse);

router.get('/', getAllCourses);

router.get('/list', getCourseList);

router.get('/:id', getCourse);

router.patch('/:id', updateCourse);

router.delete('/:id', deleteCourse);

export default router;