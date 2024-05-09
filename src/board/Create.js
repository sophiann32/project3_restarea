import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate   } from 'react-router-dom';
import styles from'./create.module.css'


function CreatePost(props) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userRealName, setUserRealName] = useState('');

    const navigate = useNavigate(); // useNavigate 훅 사용


    useEffect(() => {
        axios.get('http://localhost:3001/session', { withCredentials: true })
            .then(response => {
                if (response.data.loggedIn) {
                    setUserRealName(response.data.userRealName);
                } else {
                    // window.location.href = '/login';
                    console.log('몬가 잘안되는상황임')
                }
            })
            .catch(error => {
                console.error('세션 정보를 가져오는 중 오류 발생:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/create', {
            title: title,
            content: content
        },{ withCredentials: true })
            .then(response => {
            // .then( ()=> {
                console.log('전송버튼이 잘눌리나?' + response.data);
                // 데이터 전송 성공 후에는 `/boardMain` 페이지로 이동
                // window.location.href = '/'; // 혹은 원하시는 페이지 주소로 변경
                navigate('/board');

            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (

        <div>
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                {userRealName ? (
                    <p>
                        {userRealName}님 환영합니다. &nbsp;&nbsp;
                        <a href="/" className="button">로그아웃</a>
                    </p>
                ) : (
                    <a href="/login" className="button">로그인</a>
                )}
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label htmlFor="title">제목:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                /><br/>

                <label htmlFor="content">내용:</label><br/>
                <textarea
                    id="content"
                    name="content"
                    rows="24"
                    cols="50"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                /><br/>

                <input type="submit" value="작성하기"/>
            </form>

            <Link to="/board">이전 페이지로 돌아가기</Link>
        </div>

    );
}

export default CreatePost;
