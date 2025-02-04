import Course from '../models/Course.js';
import Student from '../models/Student.js';

// Create a new course
export const createCourse = async (req, res) => {
    try {
        const { courseCode, courseName, section, semester } = req.body;
        const newCourse = new Course({ courseCode, courseName, section, semester });
        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('students', 'firstName lastName studentNumber');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Enroll a student in a course
export const enrollStudent = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;
        const course = await Course.findById(courseId);
        const student = await Student.findById(studentId);

        if (!course || !student) return res.status(404).json({ error: "Course or student not found" });

        if (!course.students.includes(studentId)) {
            course.students.push(studentId);
            await course.save();
            res.json({ message: "Student enrolled successfully" });
        } else {
            res.json({ message: "Student already enrolled" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Drop a student from a course
export const dropStudent = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;
        const course = await Course.findById(courseId);

        if (!course) return res.status(404).json({ error: "Course not found" });

        course.students = course.students.filter(id => id.toString() !== studentId);
        await course.save();
        res.json({ message: "Student dropped from course" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// List all students in a course
export const getStudentsInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('students', 'firstName lastName studentNumber');
        if (!course) return res.status(404).json({ error: "Course not found" });
        res.json(course.students);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};