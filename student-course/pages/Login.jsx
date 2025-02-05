import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, useToast, Flex, Text } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNumber, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        toast({ title: "Login successful!", status: "success", duration: 3000 });
        navigate("/dashboard");
      } else {
        toast({ title: "Login failed", description: data.error, status: "error", duration: 3000 });
      }
    } catch (error) {
      toast({ title: "Login error", description: "Server error", status: "error", duration: 3000 });
    }
  };

  return (
    <Flex justify="center" align="center" height="100vh" bg="gray.100">
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" width="400px">
        <Heading textAlign="center" mb={6}>Login</Heading>
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Student Number</FormLabel>
              <Input type="text" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">Login</Button>
          </VStack>
        </form>
        <Text mt={4} textAlign="center">
          Don't have an account? <Link to="/register" style={{ color: "blue" }}>Sign up</Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;
