import React, { useState } from 'react';
import styles from './Header.module.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import api from '../board/axiosInstance';
import Drawer from '@mui/material/Drawer'; // Drawer 컴포넌트 추가
import Button from '@mui/material/Button'; // Button 컴포넌트 추가
import SignInSide from '../board/SignInSide'; // SignInside 컴포넌트 import
import Avatar from '@mui/material/Avatar';  // Avatar 컴포넌트 추가
import ProfileModal from '../board/profileModal';
function Header({ setIsLogin, setUser }) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const user = useSelector(state => state.auth.user);
    const username = user?.username || 'Guest';
    const profilePicture = user?.profilePicture || '/img/default-profile.png'; // 없으면 기본 프로필 이미지

    const isRestArea = location.pathname === '/restArea';
    const isJeju = location.pathname === '/jeju';
    const headerClass = isRestArea || isJeju ? `${styles.nav_wrap} ${styles.specialAreaActive}` : styles.nav_wrap;
    const [drawerOpen, setDrawerOpen] = useState(false); // Drawer 상태 추가

    const [profileOpen, setProfileOpen] = useState(false); // 프로필 모달

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    const handleProfileClick = () => {
        setProfileOpen(true);
    };

    const handleClose = () => {
        setProfileOpen(false);
    };

    return (
        <div className={headerClass}>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <NavLink to='/'>
                        <img src={"../img/logo1.png"} style={{ width: '250px' }} alt="logo" />
                    </NavLink>
                </div>
                <button className={styles.menu_button} onClick={() => setMenuOpen(!isMenuOpen)}>
                    &#9776;
                </button>
                <div className={`${styles.menu_box} ${isMenuOpen ? styles.menu_open : styles.menu_closed}`}>
                    <ul>
                        <li><NavLink to="/map">주유소찾기</NavLink></li>
                        <li><NavLink to="/restArea">휴게소 찾기</NavLink></li>
                        <li><NavLink to="/board">게시판</NavLink></li>
                        <li><NavLink to="/jeju">제주 어때🏝️</NavLink></li>
                        <li><NavLink to="/sub">유가통계</NavLink></li>
                    </ul>
                </div>
                <div className={styles.login_box}>
                    {isLoggedIn ? (
                        <div className={styles.loggedInBox}>
                            <Avatar
                                alt={username}
                                src={profilePicture}
                                onClick={handleProfileClick}
                                style={{ cursor: 'pointer'}}
                            />
                            <span className={styles.username}>{username} 님 </span>
                            <button onClick={handleLogout} className={styles.logout_button}>LOGOUT</button>
                        </div>
                    ) : (
                        <>
                            <Button onClick={toggleDrawer(true)} variant="contained">Login</Button>
                            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                                <SignInSide setIsLogin={setIsLogin} setUser={setUser} closeDrawer={() => setDrawerOpen(false)} />
                            </Drawer>
                        </>
                    )}
                </div>
                <ProfileModal open={profileOpen} onClose={handleClose} /> {/* 프로필 모달 */}
            </nav>
        </div>
    );
}

export default Header;
