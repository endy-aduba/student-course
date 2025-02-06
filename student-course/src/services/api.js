const API_URL = "http://localhost:5200/api";
// const API_URL = "http://localhost:5000/api";

export const login = async (studentNumber, password) => {
    const response = await fetch(`${API_URL}/students/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNumber, password }),
        credentials: "include"
    });
    return response.json();
};

export const fetchCourses = async () => {
    const response = await fetch(`${API_URL}/courses`, { credentials: "include" });
    return response.json();
};