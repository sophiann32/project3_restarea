import './App.css';
import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import api from "./board/axiosInstance";
import Header from "./Header_Footer/Header";
import Footer from "./Header_Footer/Footer";
import MainPage from "./routes/MainPage.js";
import MapUi from "./routes/MapUi.js";
import Statistics from "./routes/Statistics";
import Board from "./board/BoardMain";
import Login from "./board/Login";
import Register from "./board/Register";
import DetailPost from "./board/DetailPost";
import CreatePost from "./board/Create";
import RestArea from "./routes/restArea";
import Jeju from "./routes/jeju";
import Chatbot from "./chatbot/chat";
import useTokenRefresh from "./board/useTokenRefresh";

// Axios 글로벌 설정
api.defaults.baseURL = 'http://localhost:3001';
api.defaults.withCredentials = true;

function App() {
    useTokenRefresh(); // 주기적으로 토큰 갱신하는 훅

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({});
    const [loginId, setLoginId] = useState('');
    const [username, setUsername] = useState('');

    const checkLoginStatus = async () => {
        try {
            const result = await api.get('/protected');
            if (result.status === 200) {
                setIsLogin(true);
                const userData = result.data.user;
                setUser(userData);
                setIsLoggedIn(true);
                setLoginId(userData.loginId);
                setUsername(userData.username);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    await refreshAccessToken();
                    await checkLoginStatus(); // 다시 로그인 상태를 확인합니다.
                } catch (e) {
                    console.log('Failed to refresh access token', e);
                }
            } else {
                console.log(error);
            }
        }
    };

    const refreshAccessToken = async () => {
        try {
            const result = await api.post('/refresh-token');
            if (result.status === 200) {
                const expiryTime = new Date().getTime() + 60000; // 1분 후 만료 시간 설정 (60000 ms = 1분)
                console.log('Access token refreshed');
            }
        } catch (error) {
            console.error('Failed to refresh access token', error);
            setIsLogin(false);
            setUser({});
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <div className="App">
            <div id="wrap">
                <Header isLoggedIn={isLoggedIn} loginId={loginId} username={username} />
                <div id="change">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/map" element={<MapUi />} />
                        <Route path="/sub" element={<Statistics />} />
                        <Route path="/restArea" element={<RestArea />} />
                        <Route path="/restarea/:route" element={<RestArea />} />
                        <Route path="/jeju" element={<Jeju />} />
                        <Route path="/board" element={<Board isLoggedIn={isLoggedIn} loginId={loginId} username={username} />} />
                        <Route path="/boardMain/:page" element={<Board isLoggedIn={isLoggedIn} loginId={loginId} username={username} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login setIsLogin={setIsLogin} setUser={setUser} />} />
                        <Route path="/detailPost/:id" element={<DetailPost isLoggedIn={isLoggedIn} loginId={loginId} username={username} />} />
                        <Route path="/create" element={<CreatePost isLoggedIn={isLoggedIn} loginId={loginId} username={username} />} />
                        <Route path="/chatbot" element={<Chatbot isLoggedIn={isLoggedIn} loginId={loginId} username={username} />} />
                    </Routes>
                </div>
                <Footer />
            </div>
            {/*wrap 끝*/}
        </div>
        // App 끝
    );
}

export default App;
