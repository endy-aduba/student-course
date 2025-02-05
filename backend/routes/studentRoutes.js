import express from "express";
import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student Registration
router.post("/register", async (req, res) => {
  try {
    const { studentNumber, password, firstName, lastName, email, program } = req.body;
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ studentNumber, password: hashedPassword, firstName, lastName, email, role: "student", program });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Student Login
router.post("/login", async (req, res) => {
  try {
    const { studentNumber, password } = req.body;
    const student = await Student.findOne({ studentNumber });

    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Student Profile
router.get("/me", authenticate, async (req, res) => {
  res.json(req.user);
});

export default router;
