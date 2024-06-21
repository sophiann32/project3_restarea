import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';
import featureImage1 from './image/1.jpg';
import featureImage2 from './image/2.jpg';
import featureImage3 from './image/3.jpg';
import expandImage from './image/4.jpg'
import { FaYoutube, FaTwitter, FaInstagram } from 'react-icons/fa';

function LandingPage() {
    const videoUrl = "./image/elecvery.mp4";
    console.log("Video URL:", videoUrl);

    const scrollExpandSectionRef = useRef(null);
    const featureItemsRef = useRef([]);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollExpandSectionRef.current) {
                const scrollTop = window.scrollY;
                const sectionTop = scrollExpandSectionRef.current.offsetTop;
                const sectionHeight = scrollExpandSectionRef.current.offsetHeight;

                if (scrollTop > sectionTop - window.innerHeight + sectionHeight / 2) {
                    scrollExpandSectionRef.current.classList.add(styles.expand);
                } else {
                    scrollExpandSectionRef.current.classList.remove(styles.expand);
                }
            }

            featureItemsRef.current.forEach(item => {
                if (item) {
                    const rect = item.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        item.classList.add(styles.visible);
                    } else {
                        item.classList.remove(styles.visible);
                    }
                }
            });
        };

        smoothScroll();
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const smoothScroll = () => {
        const links = document.querySelectorAll(`.${styles.smoothScroll}`);
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    return (
        <div className={styles.landingContainer}>
            <section className={styles.landingVideoSection}>
                <video autoPlay loop muted className={styles.landingVideo}>
                    <source src={videoUrl} type="video/mp4"/>
                </video>
                <header className={styles.landingHeader}>
                    <nav className={styles.landingNav}>
                        <ul className={styles.navLinks}>
                            <li><a href="#features" className={styles.smoothScroll}>Features</a></li>
                            <li><a href="#about" className={styles.smoothScroll}>About</a></li>
                            <li><a href="#contact" className={styles.smoothScroll}>Contact</a></li>
                        </ul>
                    </nav>
                    <Link to="/main" className={styles.ctaButton}>Get Started</Link>
                </header>
            </section>
            <section id="features" className={styles.landingFeatures}>
                <h2>주요 기능</h2>
                <div className={styles.featureItem} ref={el => featureItemsRef.current[0] = el}>
                    <img src={featureImage1} alt="Feature 1" className={styles.featureImage}/>
                    <div className={styles.featureText}>
                        <h3>Service 1</h3>
                        <p>원하는 고속도로의 휴게소 정보 제공</p>
                        <Link to="/restArea" className={styles.learnMoreButton}>Learn More</Link>
                    </div>
                </div>
                <div className={styles.featureItem} ref={el => featureItemsRef.current[1] = el}>
                    <img src={featureImage2} alt="Feature 2" className={styles.featureImage}/>
                    <div className={styles.featureText}>
                        <h3>Service 2</h3>
                        <p>사용자 위치 기반 전기차 충전소 정보 및 실시간 상태</p>
                        <Link to="/map" className={styles.learnMoreButton}>Learn More</Link>
                    </div>
                </div>
                <div className={styles.featureItem} ref={el => featureItemsRef.current[2] = el}>
                    <img src={featureImage3} alt="Feature 3" className={styles.featureImage}/>
                    <div className={styles.featureText}>
                        <h3>Service 3</h3>
                        <p>사용자 위치 기반 주유소 정보 및 유가 실시간 업데이트</p>
                        <Link to="/map" className={styles.learnMoreButton}>Learn More</Link>
                    </div>
                </div>
            </section>
            <section id="about" className={styles.landingAbout}>
                <h2>About Us</h2>
                <p>주유소 및 휴게소 정보 제공 사이트에 오신 것을 환영합니다. 저희는 사용자들에게 실시간 정보를 제공하여 여행을 더욱 편리하게 만듭니다.</p>
            </section>
            <section id="contact" className={styles.landingContact}>
                <h2>Contact Us</h2>
                <p>문의 사항이 있으시면 언제든지 연락주세요.</p>
                <form>
                    <input type="text" placeholder="Your Name"/>
                    <input type="email" placeholder="Your Email"/>
                    <textarea placeholder="Your Message"></textarea>
                    <button type="submit">Send</button>
                </form>
                <section ref={scrollExpandSectionRef} className={styles.scrollExpandSection}>
                    <h2>전기차 충전소의 모든 정보</h2>
                    <p>충전 배달, 데이터 솔루션 공급부터 전기차 데이터 컨설팅까지</p>
                    <img src={expandImage} alt="Expand Feature" className={styles.expandFeatureImage}/>
                </section>

            </section>
            <footer className={styles.landingFooter}>
                <p>&copy; 2024 주유소 및 휴게소 정보 제공 사이트</p>
            </footer>
            <div className={styles.socialSidebar}>
                <a href="https://www.youtube.com/"><FaYoutube size={30} style={{color: 'red'}}/></a>
                <a href="https://www.twitter.com"><FaTwitter size={30} style={{color: 'blue'}}/></a>
                <a href="https://www.instagram.com/"><FaInstagram size={30} style={{color: 'orangered'}}/></a>
            </div>
        </div>
    );
}

export default LandingPage;
