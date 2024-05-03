import React, { useState } from 'react';
import styles from './Header.module.css';
import { NavLink, useLocation } from 'react-router-dom';

function Header(props) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const location = useLocation(); // 현재 위치 정보를 가져옵니다.
    const isRestArea = location.pathname === '/restArea'; // /restArea 경로인지 확인합니다.

    // /restArea일 때 사용할 스타일
    const headerClass = isRestArea ? `${styles.nav_wrap} ${styles.restAreaActive}` : styles.nav_wrap;

    return (
        <div className={headerClass}>
            <nav className={styles.nav}>
                <div className={styles.logo}><NavLink to='/'><span>STOP</span>SCAN</NavLink></div>
                <button className={styles.menu_button} onClick={() => setMenuOpen(!isMenuOpen)}>
                    &#9776;
                </button>
                <div className={`${styles.menu_box} ${isMenuOpen ? styles.menu_open : ''}`}>
                    <ul>
                        <li><NavLink to="/map">내 위치</NavLink></li>
                        <li><NavLink to="/sub">통계</NavLink></li>
                        <li><NavLink to="/restArea">휴게소</NavLink></li>
                        <li><NavLink to="/board">리뷰 게시판</NavLink></li>
                        <li><NavLink to="/jeju">제주</NavLink></li>
                    </ul>
                </div>
                <div className={styles.login_box}>
                    {props.isLoggedIn ? <div>반갑습니다.{props.userRealName}</div> :
                        <NavLink to="/login">
                            <span>LOGIN</span>
                        </NavLink>
                    }

                </div>
            </nav>
        </div>
    );
}

export default Header;
