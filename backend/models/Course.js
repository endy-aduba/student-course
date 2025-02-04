import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    section: String,
    semester: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);