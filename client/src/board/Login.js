import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import axios from "./axiosInstance";
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../redux/authSlice';
import "./login.module.css";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = () => {
        axios.post('/login', { email, password })
            .then((result) => {
                if (result.status === 200) {
                    const { accessToken, refreshToken, user } = result.data;
                    dispatch(loginSuccess({ accessToken, refreshToken, user }));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    navigate('/');
                }
            }).catch((error) => {
            console.error("Login error: ", error.response ? error.response.data : error.message);
        });
    };

    const goToRegister = () => {
        navigate('/register');
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
                <button onClick={goToRegister} className="registerButton">회원가입</button>
            </div>
        </div>
    );
}
