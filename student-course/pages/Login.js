import { useState } from 'react';

const Login = () => {
    const [studentNumber, setStudentNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/students/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentNumber, password }),
            credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) alert('Login successful');
        else alert(data.error);
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="text" placeholder="Student Number" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
