import { useState, useEffect } from 'react';
import {
	Box,
	Heading,
	FormControl,
	FormLabel,
	Input,
	Select,
	Button,
	VStack,
	useToast,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CourseManagement = () => {
	const [courses, setCourses] = useState([]);
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [courseStudents, setCourseStudents] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState('');
	const [updateSection, setUpdateSection] = useState('');
	const toast = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/');
			return;
		}

		fetchEnrolledCourses(token);
		fetchAllCourses(token);
	}, [navigate]);

	const fetchEnrolledCourses = async token => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/courses`,
				{
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const data = await response.json();
			if (response.ok) {
				setEnrolledCourses(data);
			} else {
				toast({ title: 'Error', description: data.message, status: 'error' });
			}
		} catch (error) {
			console.error('Error fetching courses:', error);
		}
	};

	const fetchAllCourses = async token => {
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
				toast({ title: 'Error', description: data.message, status: 'error' });
			}
		} catch (error) {
			console.error('Error fetching courses:', error);
		}
	};

	const enrollInCourse = async () => {
		if (!selectedCourse)
			return toast({
				title: 'Validation Error',
				description: 'All fields are required.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});

		const token = localStorage.getItem('token');
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/courses/add`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ courseId: selectedCourse }),
				}
			);
			const data = await response.json();
			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Enrolled in course!',
					status: 'success',
				});
				fetchEnrolledCourses(token);
			} else {
				toast({ title: 'Error', description: data.message, status: 'error' });
			}
		} catch (error) {
			console.error('Error enrolling in course:', error);
		}
	};

	const dropCourse = async courseId => {
		const token = localStorage.getItem('token');
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/courses/drop`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ courseId }),
				}
			);
			const data = await response.json();
			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Dropped course!',
					status: 'success',
				});
				fetchEnrolledCourses(token);
			} else {
				toast({ title: 'Error', description: data.message, status: 'error' });
			}
		} catch (error) {
			console.error('Error dropping course:', error);
		}
	};

	const updateCourse = async () => {
		const token = localStorage.getItem('token');
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/courses/update`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						courseId: selectedCourse,
						section: updateSection,
					}),
				}
			);
			const data = await response.json();
			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Course section updated!',
					status: 'success',
				});
				setCourses(prevCourses =>
					prevCourses.map(course =>
						course._id === selectedCourse
							? { ...course, section: updateSection }
							: course
					)
				);

				setSelectedCourse('');
				setUpdateSection('');
				fetchEnrolledCourses(token);
			} else {
				toast({ title: 'Error', description: data.message, status: 'error' });
			}
		} catch (error) {
			console.error('Error updating course:', error);
		}
	};

	const viewStudentsInCourse = async courseId => {
		const token = localStorage.getItem('token');
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/courses/${courseId}/students`,
				{
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const data = await response.json();
			if (response.ok) {
				setCourseStudents(data.students);
			} else {
				toast({ title: 'Error', description: data.message, status: 'error' });
			}
		} catch (error) {
			console.error('Error fetching students in course:', error);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/');
	};

	return (
		<Box p={8}>
			<Flex justify='space-between' align='center'>
				<Heading mb={6}>Course Management</Heading>
				<Button colorScheme='red' onClick={handleLogout}>
					Logout
				</Button>
			</Flex>
			<VStack spacing={4} mb={6}>
				<FormControl>
					<FormLabel>Select a Course to Enroll</FormLabel>
					<Select
						placeholder='Select course'
						onChange={e => setSelectedCourse(e.target.value)}
					>
						{courses.map(course => (
							<option key={course._id} value={course._id}>
								{course.courseName}
							</option>
						))}
					</Select>
				</FormControl>
				<Button colorScheme='blue' onClick={enrollInCourse}>
					Enroll in Course
				</Button>
			</VStack>

			<Heading size='md' mb={4}>
				Enrolled Courses
			</Heading>
			<Table variant='simple' mb={6}>
				<Thead>
					<Tr>
						<Th>Course Name</Th>
						<Th>Course Code</Th>
						<Th>Section</Th>
						<Th>Action</Th>
					</Tr>
				</Thead>
				<Tbody>
					{enrolledCourses.length > 0 ? (
						enrolledCourses.map(course => (
							<Tr key={course._id}>
								<Td>{course.courseName}</Td>
								<Td>{course.courseCode}</Td>
								<Td>{course.section}</Td>
								<Td>
									<Button
										colorScheme='red'
										onClick={() => dropCourse(course._id)}
									>
										Drop
									</Button>
								</Td>
							</Tr>
						))
					) : (
						<Tr>
							<Td colSpan={3} textAlign='center'>
								No course enrolled
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>

			<VStack spacing={4} mb={6}>
				<FormControl>
					<FormLabel>Select a Course to Update</FormLabel>
					<Select
						placeholder='Select course'
						value={selectedCourse}
						onChange={e => setSelectedCourse(e.target.value)}
					>
						{courses.map(course => (
							<option key={course._id} value={course._id}>
								{course.courseName}
							</option>
						))}
					</Select>
				</FormControl>
				<FormControl>
					<FormLabel>New Section</FormLabel>
					<Input
						placeholder='Enter new section'
						value={updateSection}
						onChange={e => setUpdateSection(e.target.value)}
					/>
				</FormControl>
				<Button
					colorScheme='teal'
					onClick={() => {
						if (!selectedCourse) {
							toast({
								title: 'Error',
								description: 'Please select a course to update.',
								status: 'error',
								duration: 3000,
								isClosable: true,
							});
							return;
						}
						updateCourse();
					}}
				>
					Update Course Section
				</Button>
			</VStack>

			<Heading size='md' mb={4}>
				Students in a Course
			</Heading>
			<Select
				placeholder='Select course'
				mb={4}
				onChange={e => viewStudentsInCourse(e.target.value)}
			>
				{courses.map(course => (
					<option key={course._id} value={course._id}>
						{course.courseName}
					</option>
				))}
			</Select>
			<Table variant='simple'>
				<Thead>
					<Tr>
						<Th>Student Name</Th>
						<Th>Email</Th>
						<Th>Student Number</Th>
					</Tr>
				</Thead>
				<Tbody>
					{courseStudents.map(student => (
						<Tr key={student._id}>
							<Td>
								{student.firstName} {student.lastName}
							</Td>
							<Td>{student.email}</Td>
							<Td>{student.studentNumber}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default CourseManagement;
