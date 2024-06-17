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
                alert("회원가입을 성공하셨습니다!");
                window.open('/', '_self');
            }
        }).catch((error) => {
            console.error("Registration error: ", error.response ? error.response.data : error.message);
        });
    };

    return (
        <div>
            <div className="registerContainer">
                <div className="inputGroup">
                    <label className="inputLabel">이메일</label>
                    <input
                        type="email"
                        placeholder="이메일을 입력해주세요"
                        className="inputValue"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">닉네임</label>
                    <input
                        type="text"
                        placeholder="닉네임을 입력해주세요"
                        className="inputValue"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">비밀번호</label>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        className="inputValue"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <button onClick={registerUser} className="registerButton">가입하기</button>
            </div>
        </div>
    );
}
