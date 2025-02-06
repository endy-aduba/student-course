import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, useToast, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbarbar";


const Register = () => {
  const [formData, setFormData] = useState({
    studentNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/students/register`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				}
			);

      const data = await response.json();

      console.log(data)
      if (response.ok) {
        toast({ title: "Registration successful!", status: "success", duration: 3000 });
        navigate("/");
      } else {
        toast({ title: "Error", description: data.error, status: "error", duration: 3000 });
      }
    } catch (e) {
      toast({
				title: `Registration failed ${e}`,
				status: 'error',
				duration: 3000,
			});
    }
  };

  return (
    
    <Flex justify="center" align="center" height="100vh" bg="gray.100">
    <Navbar />
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" width="400px">
        <Heading textAlign="center" mb={6}>Sign Up</Heading>
        <form onSubmit={handleRegister}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Student Number</FormLabel>
              <Input type="text" name="studentNumber" value={formData.studentNumber} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">Sign Up</Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;
