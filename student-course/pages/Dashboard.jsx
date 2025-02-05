import { useEffect, useState } from "react";
import { Box, Heading, Text, Button, VStack, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/students/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setStudent(data);
        } else {
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast({
      title: "Logged out",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (

    
    <Box p={8} maxWidth="500px" mx="auto">
      <Heading mb={4}>Welcome, {student?.firstName}!</Heading>
      {student ? (
        <VStack spacing={4} align="start">
          <Text><strong>Student Number:</strong> {student.studentNumber}</Text>
          <Text><strong>Name:</strong> {student.firstName} {student.lastName}</Text>
          <Text><strong>Program:</strong> {student.program}</Text>
          <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
        </VStack>
      ) : (
        <Text>Loading student data...</Text>
      )}
    </Box>
    
  );
};

export default Dashboard;
