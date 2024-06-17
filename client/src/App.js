import './App.css';
import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import api from "./board/axiosInstance";
import Header from "./Header_Footer/Header";
import Footer from "./Header_Footer/Footer";
import MainPage from "./routes/MainPage.js";
import MapUi from "./routes/MapUi.js";
import Statistics from "./routes/Statistics";
import Board from "./board/Board";
import SignUp from "./board/SignUp";
import CreatePost from './board/CreatePost'; // 글 작성 컴포넌트 임포트
import RestArea from "./routes/restArea";
import Jeju from "./routes/jeju";
import Chatbot from "./chatbot/chat";
import useTokenRefresh from "./board/useTokenRefresh";
import DetailPost from './board/DetailPost'; // 상세 게시글 컴포넌트 임포트

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
    const [drawerOpen, setDrawerOpen] = useState(false); // Drawer 상태 추가

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const checkLoginStatus = async () => {
        try {
            const result = await api.get('/protected');
            if (result.status === 200) {
                setIsLogin(true);
                const userData = result.data.user;

                // 프로필 이미지 URL 설정
                const profileImageResponse = await api.get(`/api/profile-picture/${userData.id}`);
                const profileImageUrl = profileImageResponse.data.profilePicture;

                setUser({ ...userData, profilePicture: profileImageUrl });
                setIsLoggedIn(true);
                setLoginId(userData.loginId);
                setUsername(userData.username);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

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

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <div className="App">
                    <div id="wrap">
                        <Header setIsLogin={setIsLogin} loginId={loginId} setUser={setUser} user={user} />
                        <div id="change">
                            <Routes>
                                <Route path="/main" element={<MainPage />} />
                                <Route path="/map" element={<MapUi />} />
                                <Route path="/sub" element={<Statistics />} />
                                <Route path="/restArea" element={<RestArea />} />
                                <Route path="/restarea/:route" element={<RestArea />} />
                                <Route path="/jeju" element={<Jeju />} />
                                <Route path="/board" element={<Board />} />
                                <Route path="/SignUp" element={<SignUp />} />
                                <Route path="/create-post" element={<CreatePost />} />
                                <Route path="/post/:id" element={<DetailPost />} />
                                <Route path="/chatbot" element={<Chatbot isLoggedIn={isLoggedIn} loginId={loginId} username={username} />} />
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </div>
            </PersistGate>
        </Provider>
    );
}

export default App;
