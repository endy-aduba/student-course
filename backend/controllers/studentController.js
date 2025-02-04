import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerStudent = async (req, res) => {
    try {
        const { studentNumber, password, firstName, lastName, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = new Student({ studentNumber, password: hashedPassword, firstName, lastName, email });
        await student.save();
        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const loginStudent = async (req, res) => {
    try {
        const { studentNumber, password } = req.body;
        const student = await Student.findOne({ studentNumber });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};