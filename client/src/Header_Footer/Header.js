import React, { useState } from 'react';
import styles from './Header.module.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import api from '../board/axiosInstance';
import Drawer from '@mui/material/Drawer'; // Drawer 컴포넌트 추가
import Button from '@mui/material/Button'; // Button 컴포넌트 추가
import Stack from '@mui/material/Stack';
import SignInSide from '../board/SignInSide'; // SignInside 컴포넌트 import

function Header({ setIsLogin, setUser }) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const username = useSelector(state => state.auth.user?.username);

    const isRestArea = location.pathname === '/restArea';
    const isJeju = location.pathname === '/jeju';
    const headerClass = isRestArea || isJeju ? `${styles.nav_wrap} ${styles.specialAreaActive}` : styles.nav_wrap;
    const [drawerOpen, setDrawerOpen] = useState(false); // Drawer 상태 추가

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
                            {username} 님
                            <button onClick={handleLogout} className={styles.logout_button}>LOGOUT</button>
                        </div>
                    ) : (
                        <>
                            <Button onClick={toggleDrawer(true)} variant ="contained">Login</Button>
                            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                                <SignInSide setIsLogin={setIsLogin} setUser={setUser} closeDrawer={()=> setDrawerOpen()}
                                />
                            </Drawer>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Header;
