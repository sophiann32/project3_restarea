import React from 'react';
import styles from './Header.module.css'

// style={{ textDecoration: 'none'} }

function Header(){
    return(
        <>
            <div className={styles.nav_wrap}>
            <nav className={styles.nav}>
                <div className={styles.logo}><a href='/'><span>STOP</span>SCAN</a></div>
                <div className={styles.manu_box}>
                    <ul>
                        <il><a href='/map'>내 위치</a></il>
                        <il><a href='/sub'>통계</a></il>
                    </ul>
                </div>
            </nav>
            </div>
        </>
    )
}

export default Header;