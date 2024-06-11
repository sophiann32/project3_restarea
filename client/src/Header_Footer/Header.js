import React, { useState } from 'react';
import styles from './Header.module.css';
import { NavLink, useLocation } from 'react-router-dom';

function Header(props) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const location = useLocation(); // 현재 위치 정보를 가져옵니다.
    const isRestArea = location.pathname === '/restArea'; // /restArea 경로인지 확인
    const isJeju = location.pathname === '/jeju'; // /jeju 경로인지 확인
    // /restArea일 때 사용할 스타일
    const headerClass = isRestArea || isJeju ? `${styles.nav_wrap} ${styles.specialAreaActive}` : styles.nav_wrap;

    return (
        <div className={headerClass}>
            <nav className={styles.nav}>
                <div className={styles.logo}><NavLink to='/'>
                    {/*<span>STOP</span>SCAN*/}
                    <img src={"../img/logo1.png"} style={{width : '250px'}}/>
                </NavLink></div>
                <button className={styles.menu_button} onClick={() => setMenuOpen(!isMenuOpen)}>
                    &#9776;
                    {/*이게 햄버거 모양 유니코드문자*/}
                </button>
                <div className={`${styles.menu_box} ${isMenuOpen ? styles.menu_open :styles.menu_closed}`}>
                    <ul>
                        <li><NavLink to="/map">주유소찾기</NavLink></li>
                        <li><NavLink to="/restArea">휴게소 찾기</NavLink></li>
                        <li><NavLink to="/board">게시판</NavLink></li>
                        <li><NavLink to="/jeju">제주 어때🏝️</NavLink></li>
                        <li><NavLink to="/sub">유가통계</NavLink></li>
                    </ul>
                </div>
                <div className={styles.login_box}>
                    {props.isLoggedIn ? <div>{props.username} 님</div> :
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
