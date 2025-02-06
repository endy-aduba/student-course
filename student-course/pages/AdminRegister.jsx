import { useState } from 'react';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Heading,
	VStack,
	useToast,
	Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
	const [formData, setFormData] = useState({
		studentNumber: '',
		password: '',
		firstName: '',
		lastName: '',
		email: '',
	});

	const navigate = useNavigate();
	const toast = useToast();

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleRegister = async e => {
		e.preventDefault();
		const token = localStorage.getItem('token');

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/admin/register`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(formData),
				}
			);

			const data = await response.json();
			if (response.ok) {
				toast({
					title: 'Admin Registered Successfully!',
					status: 'success',
					duration: 3000,
				});
				navigate('/admin/students');
			} else {
				toast({
					title: 'Error',
					description: data.error,
					status: 'error',
					duration: 3000,
				});
			}
		} catch (error) {
			toast({
				title: `Registration Failed: ${error}`,
				status: 'error',
				duration: 3000,
			});
		}
	};

	return (
		<Flex justify='center' align='center' height='100vh' bg='gray.100'>
			<Box bg='white' p={8} borderRadius='lg' boxShadow='lg' width='400px'>
				<Heading textAlign='center' mb={6}>
					Admin Registration
				</Heading>
				<form onSubmit={handleRegister}>
					<VStack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Student Number</FormLabel>
							<Input
								type='text'
								name='studentNumber'
								value={formData.studentNumber}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<Input
								type='password'
								name='password'
								value={formData.password}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>First Name</FormLabel>
							<Input
								type='text'
								name='firstName'
								value={formData.firstName}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Last Name</FormLabel>
							<Input
								type='text'
								name='lastName'
								value={formData.lastName}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Email</FormLabel>
							<Input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
							/>
						</FormControl>
						<Button type='submit' colorScheme='blue' width='full'>
							Register Admin
						</Button>
					</VStack>
				</form>
			</Box>
		</Flex>
	);
};

export default AdminRegister;
