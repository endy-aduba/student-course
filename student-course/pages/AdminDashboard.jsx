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
	useToast,
	Button,
	FormControl,
	FormLabel,
	VStack,
	Select,
	Input,
	Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../src/components/AdminNavBar';

const AdminDashboard = () => {
	const [students, setStudents] = useState([]);
	const [courses, setCourses] = useState([]);
	const [loggedInStudent, setLoggedInStudent] = useState(null);
	const [newStudent, setNewStudent] = useState({
		firstName: '',
		lastName: '',
		studentNumber: '',
		email: '',
		program: '',
		password: '',
	});

	const toast = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/');
			return;
		}

		fetchStudents(token);
		fetchCourses(token);
		fetchLoggedInStudent(token);
	}, [navigate]);

	const fetchLoggedInStudent = async token => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/students/me`,
				{
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const data = await response.json();
			if (response.ok) {
				setLoggedInStudent(data);
			} else {
				toast({
					title: 'Error fetching user details',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
				navigate('/');
			}
		} catch (error) {
			console.error('Error fetching logged-in user:', error);
		}
	};

	const fetchStudents = async token => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/admin/students`,
				{
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const data = await response.json();
			if (response.ok) {
				setStudents(data);
			} else {
				console.error('Error fetching students:', data.message);
			}
		} catch (error) {
			console.error('Error fetching students:', error);
		}
	};

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

	const handleAddStudent = async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/');
			return;
		}

		if (
			!newStudent.firstName.trim() ||
			!newStudent.lastName.trim() ||
			!newStudent.studentNumber.trim() ||
			!newStudent.email.trim() ||
			!newStudent.program.trim() ||
			!newStudent.password.trim()
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

		console.log({newStudent})

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/admin/students`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newStudent),
				}
			);

			const data = await response.json();
			if (response.ok) {
				toast({ title: 'Student added successfully!', status: 'success' });
				setStudents(prev => [...prev, data.student]);
				setNewStudent({
					firstName: '',
					lastName: '',
					studentNumber: '',
					email: '',
					program: '',
					password: '',
				});
			} else {
				toast({
					title: 'Error adding student',
					description: data.message,
					status: 'error',
				});
			}
		} catch (error) {
			console.error('Error adding student:', error);
			toast({ title: 'Server error', status: 'error' });
		}
	};

	const deleteStudent = async studentId => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				toast({ title: 'Unauthorized', status: 'error' });
				return;
			}

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/admin/students/${studentId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await response.json();

			if (response.ok) {
				toast({ title: 'Student deleted successfully!', status: 'success' });
				setStudents(prevStudents =>
					prevStudents.filter(student => student._id !== studentId)
				);
			} else {
				toast({ title: 'Error', description: data.error, status: 'error' });
			}
		} catch (error) {
			console.error('Error deleting student:', error);
			toast({ title: 'Server error', status: 'error' });
		}
	};

	return (
		<Box p={8}>
			<AdminNavbar />
			<Heading mb={6}>Admin Dashboard - Manage Students</Heading>

			<Box p={8}>
				<Heading size='md' mb={4}>
					All Students
				</Heading>
				<Table variant='simple'>
					<Thead>
						<Tr>
							<Th>Student Number</Th>
							<Th>Name</Th>
							<Th>Program</Th>
							<Th>Email</Th>
						</Tr>
					</Thead>
					<Tbody>
						{students.length > 0 ? (
							students.map(student => (
								<Tr key={student.studentNumber}>
									<Td>{student.studentNumber}</Td>
									<Td>
										{student.firstName} {student.lastName}
									</Td>
									<Td>{student.program}</Td>
									<Td>{student.email}</Td>
									<Td>
										{loggedInStudent && loggedInStudent._id === student._id ? (
											<Text style={{ cursor: 'not-allowed' }} color='gray.500'>
												Cannot delete yourself
											</Text>
										) : (
											<Button
												colorScheme='red'
												size='sm'
												onClick={() => deleteStudent(student._id)}
											>
												Delete
											</Button>
										)}
									</Td>
								</Tr>
							))
						) : (
							<Tr>
								<Td colSpan={3} textAlign='center'>
									No student currently
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>

			<Box mb={6}>
				<Heading size='md' mb={4}>
					Add a Student
				</Heading>
				<VStack spacing={4} align='start'>
					<FormControl>
						<FormLabel>First Name</FormLabel>
						<Input
							value={newStudent.firstName}
							onChange={e =>
								setNewStudent({ ...newStudent, firstName: e.target.value })
							}
							required
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Last Name</FormLabel>
						<Input
							value={newStudent.lastName}
							onChange={e =>
								setNewStudent({ ...newStudent, lastName: e.target.value })
							}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Student Number</FormLabel>
						<Input
							value={newStudent.studentNumber}
							onChange={e =>
								setNewStudent({
									...newStudent,
									studentNumber: e.target.value,
								})
							}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Email</FormLabel>
						<Input
							value={newStudent.email}
							onChange={e =>
								setNewStudent({ ...newStudent, email: e.target.value })
							}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Select Course</FormLabel>
						<Select
							value={newStudent.program}
							onChange={e =>
								setNewStudent({ ...newStudent, program: e.target.value })
							}
						>
							<option value=''>Select a course</option>
							{courses.map(course => (
								<option key={course._id} value={course._id}>
									{course.courseName}
								</option>
							))}
						</Select>
					</FormControl>

					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							value={newStudent.password}
							onChange={e =>
								setNewStudent({ ...newStudent, password: e.target.value })
							}
							type='password'
						/>
					</FormControl>
					<Button colorScheme='blue' onClick={handleAddStudent}>
						Add Student
					</Button>
				</VStack>
			</Box>
		</Box>
	);
};

export default AdminDashboard;
