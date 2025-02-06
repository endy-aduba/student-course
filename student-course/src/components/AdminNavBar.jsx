import { Box, Flex, Button } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/');
	};

	return (
		<Box bg='blue.500' p={4} color='white'>
			<Flex justify='space-between' align='center'>
				<Flex gap={6}>
					<NavLink
						to='/admin/students'
						style={({ isActive }) => ({
							fontWeight: isActive ? 'bold' : 'normal',
							textDecoration: 'none',
						})}
					>
						Students
					</NavLink>
					<NavLink
						to='/admin/courses'
						style={({ isActive }) => ({
							fontWeight: isActive ? 'bold' : 'normal',
							textDecoration: 'none',
						})}
					>
						Courses
					</NavLink>
				</Flex>
				<Button colorScheme='red' onClick={handleLogout}>
					Logout
				</Button>
			</Flex>
		</Box>
	);
};

export default AdminNavbar;
