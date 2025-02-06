import { useEffect, useState } from 'react';
import {
	Box,
	Heading,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	FormControl,
	FormLabel,
	Select,
	Input,
	Button,
	useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../src/components/AdminNavBar';

const AdminDashboardCourses = () => {
	const [courses, setCourses] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState('');
	const [studentsInCourse, setStudentsInCourse] = useState([]);
	const [newCourse, setNewCourse] = useState({
		courseName: '',
		courseCode: '',
		semester: '',
		section: '',
	});

	const navigate = useNavigate();
	const toast = useToast();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/');
			return;
		}

		fetchCourses(token);
	}, [navigate]);

	const fetchCourses = async token => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/admin/courses`,
				{
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const data = await response.json();
			if (response.ok) {
				setCourses(data);
			} else {
				console.error('Error fetching courses:', data.message);
			}
		} catch (error) {
			console.error('Error fetching courses:', error);
		}
	};

	const fetchStudentsInCourse = async courseId => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/');
			return;
		}

		try {
			const response = await fetch(
				`${
					import.meta.env.VITE_API_URL
				}/api/admin/courses/${courseId}/students`,
				{
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const data = await response.json();
			if (response.ok) {
				setStudentsInCourse(data.students);
			} else {
				console.error('Error fetching students in course:', data.message);
			}
		} catch (error) {
			console.error('Error fetching students in course:', error);
		}
	};

	const handleAddCourse = async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/');
			return;
		}

		// Validate required fields
		if (
			!newCourse.courseName ||
			!newCourse.courseCode ||
			!newCourse.semester ||
			!newCourse.section
		) {
			toast({
				title: 'Validation Error',
				description: 'All fields are required.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/admin/courses`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newCourse),
				}
			);

			const data = await response.json();
			if (response.ok) {
				toast({ title: 'Course added successfully!', status: 'success' });
				setCourses(prev => [...prev, data.course]);
				setNewCourse({
					courseName: '',
					courseCode: '',
					semester: '',
					section: '',
				});
			} else {
				toast({
					title: 'Error adding course',
					description: data.message,
					status: 'error',
				});
			}
		} catch (error) {
			console.error('Error adding course:', error);
			toast({ title: 'Server error', status: 'error' });
		}
	};

	return (
		<Box p={8}>
			<AdminNavbar />
			<Heading mb={6}>Admin Dashboard - Manage Courses</Heading>

			<Box mb={6}>
				<Heading size='md' mb={4}>
					All Courses
				</Heading>
				<Table variant='simple'>
					<Thead>
						<Tr>
							<Th>Course Name</Th>
							<Th>Course Code</Th>
							<Th>Semester</Th>
							<Th>section</Th>
						</Tr>
					</Thead>
					<Tbody>
						{courses.length > 0 ? (
							courses.map(course => (
								<Tr key={course._id}>
									<Td>{course.courseName}</Td>
									<Td>{course.courseCode}</Td>
									<Td>{course.semester}</Td>
									<Td>{course.section}</Td>
								</Tr>
							))
						) : (
							<Tr>
								<Td colSpan={3} textAlign='center'>
									No course created
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>

			<Box>
				<Heading size='md' mb={4}>
					Add a Course
				</Heading>
				<FormControl>
					<FormLabel>Course Name</FormLabel>
					<Input
						value={newCourse.courseName}
						onChange={e =>
							setNewCourse({ ...newCourse, courseName: e.target.value })
						}
					/>
				</FormControl>
				<FormControl>
					<FormLabel>Course Code</FormLabel>
					<Input
						value={newCourse.courseCode}
						onChange={e =>
							setNewCourse({ ...newCourse, courseCode: e.target.value })
						}
					/>
				</FormControl>
				<FormControl>
					<FormLabel>Semester</FormLabel>
					<Input
						value={newCourse.semester}
						onChange={e =>
							setNewCourse({ ...newCourse, semester: e.target.value })
						}
					/>
				</FormControl>
				<FormControl>
					<FormLabel>Section</FormLabel>
					<Input
						value={newCourse.section}
						onChange={e =>
							setNewCourse({ ...newCourse, section: e.target.value })
						}
					/>
				</FormControl>
				<Button colorScheme='blue' my={4} onClick={handleAddCourse}>
					Add Course
				</Button>
			</Box>

			<Box>
				<Heading size='md' mb={4}>
					Students in a Course
				</Heading>
				<FormControl mb={4}>
					<FormLabel>Select Course</FormLabel>
					<Select
						value={selectedCourse}
						onChange={e => {
							setSelectedCourse(e.target.value);
							fetchStudentsInCourse(e.target.value);
						}}
					>
						<option value=''>Select a course</option>
						{courses.map(course => (
							<option key={course._id} value={course._id}>
								{course.courseName}
							</option>
						))}
					</Select>
				</FormControl>
				<Table variant='simple'>
					<Thead>
						<Tr>
							<Th>Student Number</Th>
							<Th>Name</Th>
							<Th>Email</Th>
						</Tr>
					</Thead>
					<Tbody>
						{studentsInCourse.length > 0 ? (
							studentsInCourse.map(student => (
								<Tr key={student.studentNumber}>
									<Td>{student.studentNumber}</Td>
									<Td>
										{student.firstName} {student.lastName}
									</Td>
									<Td>{student.email}</Td>
								</Tr>
							))
						) : (
							<Tr>
								<Td colSpan={3} textAlign='center'>
									No students enrolled
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>
		</Box>
	);
};

export default AdminDashboardCourses;
