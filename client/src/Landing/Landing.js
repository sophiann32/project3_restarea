import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';
import featureImage1 from './image/1.jpg';
import featureImage2 from './image/a.gif';
import featureImage3 from './image/3.jpg';
import expandImage from './image/g.gif';
import Modal from './Modal'; // 모달 컴포넌트 import
import { FaYoutube, FaTwitter, FaInstagram } from 'react-icons/fa';

function LandingPage() {
    const videoUrl = "./image/elecvery.mp4";
    const scrollExpandSectionRef = useRef(null);
    const featureItemsRef = useRef([]);
    const [expandImageWidth, setExpandImageWidth] = useState('70%'); // 초기 너비
    const [showModal, setShowModal] = useState(false); // 모달 상태 관리

    useEffect(() => {
        // 스크롤 이벤트 및 IntersectionObserver 설정
        const handleScroll = () => {
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

        window.addEventListener('scroll', handleScroll);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const newWidth = `${70 + entry.intersectionRatio * 35}%`; // 80%에서 100%까지
                    setExpandImageWidth(newWidth);
                }
            },
            {
                threshold: Array.from({ length: 101 }, (_, i) => i * 0.01),
            }
        );

        if (scrollExpandSectionRef.current) {
            observer.observe(scrollExpandSectionRef.current);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollExpandSectionRef.current) {
                observer.unobserve(scrollExpandSectionRef.current);
            }
        };
    }, []);

    const handleSmoothScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <div className={styles.landingContainer}>
            <section className={styles.landingVideoSection}>
                <video autoPlay loop muted className={styles.landingVideo}>
                    <source src={videoUrl} type="video/mp4" />
                </video>
                <header className={styles.landingHeader}>
                    <nav className={styles.landingNav}>
                        <ul className={styles.navLinks}>
                            <li><a onClick={() => handleSmoothScroll('features')} className={styles.smoothScroll}>Features</a></li>
                            <li><a onClick={() => handleSmoothScroll('about')} className={styles.smoothScroll}>About</a></li>
                            <li><a onClick={() => handleSmoothScroll('contact')} className={styles.smoothScroll}>Contact</a></li>
                        </ul>
                    </nav>
                    <Link to="/main" className={styles.ctaButton}>Get Started</Link>
                </header>
            </section>
            <section id="features" className={styles.landingFeatures}>
                <div className={styles.featureItem} ref={el => featureItemsRef.current[0] = el}>
                    <div className={styles.featureImageContainer}>
                        <img src={featureImage1} alt="Feature 1" className={styles.featureImage} />
                    </div>
                    <div className={styles.featureTextContainer}>
                        <h3>Service 1</h3>
                        <p>원하는 고속도로의 휴게소 정보 제공</p>
                        <Link to="/restArea" className={styles.learnMoreButton}>Learn More</Link>
                    </div>
                </div>
                <div className={styles.featureItem} ref={el => featureItemsRef.current[1] = el}>
                    <div className={styles.aGifSection}>
                        <div className={styles.featureTextContainer2}>
                            <h3>Service 2</h3>
                            <p>사용자 위치 기반 전기차 충전소 정보 및 실시간 상태</p>
                            <Link to="/map" className={styles.learnMoreButton}>Learn More</Link>
                        </div>
                        <img src={featureImage2} alt="Feature 2" className={styles.aGifImage} />
                    </div>
                </div>
                <div className={styles.featureItem} ref={el => featureItemsRef.current[2] = el}>
                    <div className={styles.featureImageContainer}>
                        <img src={featureImage3} alt="Feature 3" className={styles.featureImage} />
                    </div>
                    <div className={styles.featureTextContainer3}>
                        <h3>Service 3</h3>
                        <p>사용자 위치 기반 주유소 정보 및 유가 실시간 업데이트</p>
                        <Link to="/map" className={styles.learnMoreButton}>Learn More</Link>
                    </div>
                </div>
            </section>
            <section id="about" className={styles.landingAbout}>
                <h2>About Us</h2>
                <p>온디멘드</p>
            </section>
            <section id="contact" className={styles.landingContact}>
                <h2>Contact Us</h2>
                <section id="expandFeature" ref={scrollExpandSectionRef} className={`${styles.scrollExpandSection} ${styles.expandFeatureSection}`}>
                    <h2>전기차 충전소의 모든 정보</h2>
                    <p>주유소 및 휴게소 정보 제공 사이트에 오신 것을 환영합니다. <br />저희는 사용자들에게 실시간 정보를 제공하여 여행을 더욱 편리하게 만듭니다.</p>
                    <div className={styles.expandButtonContainer}>
                        <button className={styles.expandButton} onClick={openModal}>
                            <span>Watch Intro Video</span>
                            <div className={styles.wave}></div>
                        </button>
                    </div>
                    {showModal && <Modal onClose={closeModal} videoUrl={videoUrl} />}
                    <img src={expandImage} alt="Expand Feature" className={styles.expandFeatureImage} style={{ width: expandImageWidth }} />
                </section>
            </section>
            <footer className={styles.landingFooter}>
                <p>&copy; STOP SCAN<br /> 2024 주유소 및 휴게소 정보 제공 사이트 </p>
            </footer>
            <div className={styles.socialSidebar}>
                <a href="https://www.youtube.com/"><FaYoutube size={30} style={{ color: 'red' }} /></a>
                <a href="https://www.twitter.com"><FaTwitter size={30} style={{ color: 'blue' }} /></a>
                <a href="https://www.instagram.com/"><FaInstagram size={30} style={{ color: 'orangered' }} /></a>
            </div>
        </div>
    );
}

export default LandingPage;
