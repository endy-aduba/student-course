import { useEffect, useState } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, useToast } from "@chakra-ui/react";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/students", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setStudents(data);
        } else {
          toast({
            title: "Access Denied",
            description: "You do not have admin access",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [toast]);

  return (
    <Box p={8}>
      <Heading mb={6}>Admin Dashboard - Manage Students</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Student Number</Th>
            <Th>Name</Th>
            <Th>Program</Th>
          </Tr>
        </Thead>
        <Tbody>
          {students.map((student) => (
            <Tr key={student.studentNumber}>
              <Td>{student.studentNumber}</Td>
              <Td>{student.firstName} {student.lastName}</Td>
              <Td>{student.program}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AdminDashboard;