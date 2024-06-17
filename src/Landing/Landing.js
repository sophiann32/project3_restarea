import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import featureImage from './image/a.gif';
import { FaYoutube, FaTwitter, FaInstagram } from 'react-icons/fa';

function LandingPage() {
    const videoUrl = "./image/elecvery.mp4";
    console.log("Video URL:", videoUrl);

    const scrollExpandSectionRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollExpandSectionRef.current) {
                const scrollTop = window.scrollY;
                const sectionTop = scrollExpandSectionRef.current.offsetTop;
                const sectionHeight = scrollExpandSectionRef.current.offsetHeight;

                if (scrollTop > sectionTop - window.innerHeight + sectionHeight / 2) {
                    scrollExpandSectionRef.current.classList.add('expand');
                } else {
                    scrollExpandSectionRef.current.classList.remove('expand');
                }
            }
        };

        smoothScroll();
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const smoothScroll = () => {
        const links = document.querySelectorAll('.smooth-scroll');
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
        <div className="landing-container">
            <section className="landing-video-section">
                <video autoPlay loop muted className="landing-video">
                    <source src={videoUrl} type="video/mp4"/>
                </video>
                <header className="landing-header">
                    <nav className="landing-nav">
                        <ul className="nav-links">
                            <li><a href="#features" className="smooth-scroll">Features</a></li>
                            <li><a href="#about" className="smooth-scroll">About</a></li>
                            <li><a href="#contact" className="smooth-scroll">Contact</a></li>
                        </ul>
                    </nav>
                    {/*<div className="header-content">*/}
                        {/*<h2>정보 제공 및 실시간 업데이트</h2>*/}
                        {/*<p>사용자의 위치 기반으로 주유소 및 전기차 충전소 정보를 실시간으로 업데이트해드립니다.</p>*/}
                        <Link to="/map" className="cta-button">Get Started</Link>
                    {/*</div>*/}
                </header>
            </section>
            <section id="features" className="landing-features">
                <h2>주요 기능</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>Service 1</h3>
                        <p>원하는 고속도로의 휴게소 정보 제공</p>
                        <Link to="/restArea" className="learn-more-button">Learn More</Link>
                    </div>
                    <div className="feature-item">
                        <h3>Service 2</h3>
                        <p>사용자 위치 기반 전기차 충전소 정보 및 실시간 상태</p>
                        <Link to="/map" className="learn-more-button">Learn More</Link>
                    </div>
                    <div className="feature-item">
                        <h3>Service 3</h3>
                        <p>사용자 위치 기반 주유소 정보 및 유가 실시간 업데이트</p>
                        <Link to="/map" className="learn-more-button">Learn More</Link>
                    </div>
                </div>
                <img src={featureImage} alt="Feature" className="feature-image"/>
            </section>
            <section id="about" className="landing-about">
                <h2>About Us</h2>
                <p>주유소 및 휴게소 정보 제공 사이트에 오신 것을 환영합니다. 저희는 사용자들에게 실시간 정보를 제공하여 여행을 더욱 편리하게 만듭니다.</p>
            </section>
            <section id="contact" className="landing-contact">
                <h2>Contact Us</h2>
                <p>문의 사항이 있으시면 언제든지 연락주세요.</p>
                <form>
                    <input type="text" placeholder="Your Name"/>
                    <input type="email" placeholder="Your Email"/>
                    <textarea placeholder="Your Message"></textarea>
                    <button type="submit">Send</button>
                </form>
                <section ref={scrollExpandSectionRef} className="scroll-expand-section">
                    {/*<h2>전기차 충전소의 모든 정보</h2>*/}
                    {/*<p>충전 배달, 데이터 솔루션 공급부터 전기차 데이터 컨설팅까지</p>*/}
                    {/*<img src={featureImage} alt="Expand Feature" className="expand-feature-image"/>*/}
                </section>
            </section>
            <footer className="landing-footer">
                <p>&copy; 2024 주유소 및 휴게소 정보 제공 사이트</p>
            </footer>
            <div className="social-sidebar">
                <a href="https://www.youtube.com/"><FaYoutube size={30} style={{color: 'red'}}/></a>
                <a href="https://www.twitter.com"><FaTwitter size={30} style={{color: 'blue'}}/></a>
                <a href="https://www.instagram.com/"><FaInstagram size={30} style={{color: 'orangered'}}/></a>
            </div>
        </div>
    );
}



export default LandingPage;
