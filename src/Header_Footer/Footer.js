import React from 'react';
import styles from './Footer.module.css'



function Footer(){
    return(
        <>
            <footer className={styles.footer}>
                <div  className={styles.footer_div1}>한국 석유공사 산업 통상자원부</div>
                <div>
                <ul className={styles.footer_ul}>
                    <li>개인정보처리방침</li>
                    <li>저작거권정책</li>
                    <li>이메일 주소 무단수집거부</li>
                    <li>원격지원요청</li>
                </ul>
                </div>
                <div>울릉도 광역시 종로3가 논현동 사업번호 123-234-432  </div>
                <div>stopscan corporation</div>

            </footer>
        </>
    )
}

export default Footer;