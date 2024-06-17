import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from './axiosInstance';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]); // 이미지 상태 추가
    const user = useSelector((state) => state.auth.user);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('로그인 후 글을 작성할 수 있습니다.');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('USER_ID', Number(user.id));  // USER_ID를 숫자로 변환
        formData.append('TITLE', title);
        formData.append('CONTENT', content);
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        console.log('FormData:', Array.from(formData.entries())); // FormData 로그 추가

        try {
            await api.post('/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('글 작성 완료!');
            navigate('/board');
        } catch (error) {
            console.error('Failed to create post', error);
            alert('글 작성 실패');
        }
    };

    return (
        <div>
            <h1>글 작성</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>이미지 업로드</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit">작성</button>
            </form>
        </div>
    );
};

export default CreatePost;
