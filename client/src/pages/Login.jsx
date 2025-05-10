import React, { useState } from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Basic success message; implement actual logic later
        alert(`Successfully logged in as ${username}`);

        // Make sure to reset both fields after the user submits their login information
        setUsername('');
        setPassword('');
    };

    return (
        <form onSubmit={handleLogin} style={{display: "flex", flexDirection: "column", maxWidth: '300px'}}>
            <h3>Login</h3>

            <label>Username</label>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
            />

            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />

            <button>Login</button>
        </form>
    );
};

export default Login;