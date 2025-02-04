import express from 'express';
import { createCourse, getAllCourses, enrollStudent, dropStudent, getStudentsInCourse } from '../controllers/courseController.js';

const router = express.Router();

router.post('/create', createCourse);
router.get('/', getAllCourses);
router.post('/enroll', enrollStudent);
router.post('/drop', dropStudent);
router.get('/:courseId/students', getStudentsInCourse);

export default router;