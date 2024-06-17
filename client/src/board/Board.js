import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './axiosInstance'; // axios 인스턴스 불러오기
import styles from './Board.module.css'; // CSS 모듈 불러오기

const Board = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/api/posts', {
                    params: { page, limit }
                });
                setPosts(response.data);
            } catch (error) {
                console.error('전송실패', error);
            }
        };

        fetchPosts();
    }, [page]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/api/posts`, {
                params: { [searchType]: searchQuery, page, limit }
            });
            setPosts(response.data);
        } catch (error) {
            console.error(`${searchType}으로 검색실패`, error);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className={styles.boardContainer}>
            <h1 className={styles.header}>게시판</h1>

            <div>
                <ul className={styles.postList}>
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <li className={styles.postItem} key={post.POST_ID}>
                                <h3>
                                    <Link to={`/post/${post.POST_ID}`}>
                                        {post.TITLE}
                                    </Link>
                                </h3>
                                <p>{post.CONTENT}</p>
                                {post.IMAGES && post.IMAGES.length > 0 && (
                                    <div className={styles.imageContainer}>
                                        {post.IMAGES.map((image, index) => (
                                            <img
                                                key={index}
                                                src={`data:${image.mimeType};base64,${image.data}`} // MIME 타입을 지정
                                                alt="게시글 이미지"
                                                className={styles.postImage}
                                            />
                                        ))}
                                    </div>
                                )}
                                <p>작성자: {post.USERNAME}</p>
                                <p>작성일: {new Date(post.CREATED_AT).toLocaleString()}</p>
                            </li>
                        ))
                    ) : (
                        <p className={styles.noPosts}>게시글이 없습니다.</p>
                    )}
                </ul>
            </div>

            <div>
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <select
                        className={styles.searchSelect}
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="title">제목으로 검색</option>
                        <option value="userId">사용자 ID로 검색</option>
                    </select>
                    <input
                        type="text"
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="검색어를 입력하세요"
                    />
                    <button type="submit" className={styles.searchButton}>검색</button>
                </form>
            </div>

            <div className={styles.pagination}>
                <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    이전
                </button>
                <span className={styles.pageNumber}>{page}</span>
                <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={posts.length < limit}
                >
                    다음
                </button>
            </div>

            <div>
                <button className={styles.createPostButton} onClick={() => window.location.href = '/create-post'}>글 작성</button>
            </div>
        </div>
    );
};

export default Board;
