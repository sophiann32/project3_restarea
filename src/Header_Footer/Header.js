import React, { useState } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <div className={styles.nav_wrap}>
            <nav className={styles.nav}>
                <div className={styles.logo}><a href='/'><span>STOP</span>SCAN</a></div>
                <button
                    className={styles.menu_button}
                    onClick={() => setMenuOpen(!isMenuOpen)}
                >
                    &#9776;
                </button>
                <div className={`${styles.menu_box} ${isMenuOpen ? styles.menu_open : ''}`}>
                    <ul>
                        <li><a href='/map'>내 위치</a></li>
                        <li><a href='/sub'>통계</a></li>
                        <li>
                            <Link to="/board">리뷰 게시판</Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.login_box}>
                    <Link to="/login">
                        <span>LOGIN</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default Header;
