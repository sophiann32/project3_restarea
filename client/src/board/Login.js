import React, { useState } from "react";
import axios from "axios";
import "./login.module.css";

export default function Login({ setIsLogin, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        axios({
            url: "http://localhost:3001/login",
            method: "POST",
            withCredentials: true, // 쿠키 포함 설정
            data: { email, password }
        }).then((result) => {
            if (result.status === 200) {
                setIsLogin(true);
                window.open('/', '_self');
            }
        }).catch((error) => {
            console.error("Login error: ", error.response ? error.response.data : error.message);
        });
    };

    return (
        <div>
            <div className="loginContainer">
                <div className="inputGroup">
                    <label className="inputLabel">email</label>
                    <input
                        type="email"
                        placeholder="email"
                        className="inputValue"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">password</label>
                    <input
                        type="password"
                        placeholder="password"
                        className="inputValue"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <button onClick={login} className="loginButton">Login</button>
            </div>
        </div>
    );
}
