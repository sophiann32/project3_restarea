import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from './axiosInstance';
import styles from './detailPost.module.css';

const DetailPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [recommendationCount, setRecommendationCount] = useState(0);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/api/posts/${id}`);
                setPost(response.data);
                setEditTitle(response.data.TITLE);
                setEditContent(response.data.CONTENT);
                const recResponse = await api.get(`/api/posts/${id}/recommendations`);
                setRecommendationCount(recResponse.data.recommendationCount);
            } catch (error) {
                console.error('게시글 가져오기 실패', error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await api.get(`/api/posts/${id}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error('댓글 가져오기 실패', error);
            }
        };

        fetchPost();
        fetchComments();
    }, [id]);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/posts/${id}`);
            alert('글 삭제 완료');
            navigate('/board');
        } catch (error) {
            console.error('글 삭제 실패', error);
            if (error.response.status === 403) {
                alert('권한이 없습니다.');
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/comments', { POST_ID: id, USER_ID: user.id, CONTENT: newComment });
            setNewComment('');
            const response = await api.get(`/api/posts/${id}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('댓글 작성 실패', error);
        }
    };

    const handleRecommend = async () => {
        try {
            const response = await api.post('/api/recommendations', { POST_ID: id, USER_ID: user.id });
            alert('추천 완료');
            setRecommendationCount(response.data.recommendationCount);
        } catch (error) {
            console.error('추천 실패', error);
            if (error.response.status === 400) {
                alert('이미 추천하셨습니다.');
            }
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/posts/${id}`, { TITLE: editTitle, CONTENT: editContent });
            setPost({ ...post, TITLE: editTitle, CONTENT: editContent });
            setIsEditing(false);
        } catch (error) {
            console.error('글 수정 실패', error);
            if (error.response.status === 403) {
                alert('권한이 없습니다.');
            }
        }
    };

    return (
        <div className={styles.detailPostContainer}>
            {user && user.id === post.USER_ID && (
                <>
                    <button onClick={handleDelete}>글 삭제</button>
                    <button onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? '취소' : '글 수정'}
                    </button>
                </>
            )}

            {isEditing ? (
                <form onSubmit={handleEdit} className={styles.editForm}>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        required
                    />
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        required
                    />
                    <button type="submit">수정 완료</button>
                </form>
            ) : (
                <>
                    <h1>{post.TITLE}</h1>
                    <p>{post.CONTENT}</p>
                    <p>작성자: {post.USERNAME}</p>
                    <p>작성일: {new Date(post.CREATED_AT).toLocaleString()}</p>
                </>
            )}

            <button onClick={handleRecommend}>추천</button>
            <p>추천 수: {recommendationCount}</p>

            <h2>댓글</h2>
            <ul className={styles.commentList}>
                {comments.map(comment => (
                    <li key={comment.COMMENT_ID}>
                        <p>{comment.CONTENT}</p>
                        <p>작성자: {comment.USERNAME}</p>
                        <p>작성일: {new Date(comment.CREATED_AT).toLocaleString()}</p>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    required
                />
                <button type="submit">댓글 작성</button>
            </form>
        </div>
    );
};

export default DetailPost;
