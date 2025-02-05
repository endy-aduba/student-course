import express from "express";
import Student from "../models/Student.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { adminAuthenticate } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Fetch all students (Admin Only)
router.get("/students", authenticate, adminAuthenticate, async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin Registration (Only Admins can register new Admins)
router.post("/register", authenticate, adminAuthenticate, async (req, res) => {
  try {
    const { studentNumber, password, firstName, lastName, email } = req.body;
    const existingAdmin = await Student.findOne({ email });

    if (existingAdmin) return res.status(400).json({ error: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Student({ studentNumber, password: hashedPassword, firstName, lastName, email, role: "admin" });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
