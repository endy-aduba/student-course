import express from "express";
import Course from "../models/Course.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/** ==========================
 * ✅ ADD A NEW COURSE (Admin Only)
 =========================== */
router.post("/add", authenticate, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin access required" });

  try {
    const { courseCode, courseName, section, semester } = req.body;
    const course = new Course({ courseCode, courseName, section, semester });

    await course.save();
    res.status(201).json({ message: "Course added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** ==========================
 * ✅ GET ALL COURSES
 =========================== */
router.get("/", authenticate, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** ==========================
 * ✅ ENROLL IN A COURSE (Student)
 =========================== */
router.post("/enroll", authenticate, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ error: "Students only" });

  try {
    const { courseCode } = req.body;
    const course = await Course.findOne({ courseCode });

    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.students.includes(req.user._id)) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    course.students.push(req.user._id);
    await course.save();

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** ==========================
 * ✅ DROP A COURSE (Student)
 =========================== */
router.post("/drop", authenticate, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ error: "Students only" });

  try {
    const { courseCode } = req.body;
    const course = await Course.findOne({ courseCode });

    if (!course) return res.status(404).json({ error: "Course not found" });

    course.students = course.students.filter((id) => id.toString() !== req.user._id.toString());
    await course.save();

    res.json({ message: "Course dropped successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** ==========================
 * ✅ LIST COURSES ENROLLED BY A STUDENT
 =========================== */
router.get("/my-courses", authenticate, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ error: "Students only" });

  try {
    const courses = await Course.find({ students: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
