import express from 'express';
import { getStudents, getAllStudents, getFilteredStudents, getFilteredStudentByUserId, createStudent, createBulkStudents, 
    updateStudentDetails, updateAcademicDetails, updateFamilyDetails, updateAdmissionDetails, updateStudentAddress, updateStudentQualifications,
    deleteStudentByUserId, deleteAllStudents, getAdvancedSearchStudents, 
    searchStudents, filterStudents } from '../controllers/user/students.controller.js';
import { verifyToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getStudents);

router.get('/all', getAllStudents);

router.get('/filter', getFilteredStudents);

router.get('/filter/:id', getFilteredStudentByUserId);

router.post('/', createStudent);

router.post('/bulk', createBulkStudents);

router.get('/advanced-search', getAdvancedSearchStudents);

// router.post('/import', uploadBulkStaff);

// * Update
router.patch('/personal/:studentId', updateStudentDetails);

router.patch('/academic/:studentId', updateAcademicDetails);

router.patch('/family/:studentId', updateFamilyDetails);

router.patch('/admission/:studentId', updateAdmissionDetails);

router.patch('/address/:studentId', updateStudentAddress);

router.patch('/qualifications/:studentId', updateStudentQualifications);


// * Delete
router.delete('/one/:userId', deleteStudentByUserId);

router.delete('/all', deleteAllStudents);

// router.get('/:id', verifyToken, authorizeRole('staff'), getStaffById);


router.post('/search', searchStudents);

router.post('/filter', filterStudents);

export default router;
