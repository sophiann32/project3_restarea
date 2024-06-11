import React, { useState } from "react";
import axios from "axios";
import "./register.module.css";

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const registerUser = () => {
        axios({
            url: "http://localhost:3001/register",
            method: "POST",
            withCredentials: true,
            data: { email, username, password }
        }).then((result) => {
            if (result.status === 201) {
                alert("Registration successful!");
                window.open('/login', '_self');
            }
        }).catch((error) => {
            console.error("Registration error: ", error.response ? error.response.data : error.message);
        });
    };

    return (
        <div>
            <div className="registerContainer">
                <div className="inputGroup">
                    <label className="inputLabel">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="inputValue"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        className="inputValue"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        className="inputValue"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <button onClick={registerUser} className="registerButton">Register</button>
            </div>
        </div>
    );
}
