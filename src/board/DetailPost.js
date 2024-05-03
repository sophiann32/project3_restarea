import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './detailPost.module.css'

import {useParams, Link } from 'react-router-dom'; // React Router가 필요합니다.

function DetailPost(props) {
    const [detailPostData, setDetailPostData] = useState({});
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:3001/detailPost/${id}`,{withCredentials: true} )
            .then(res => {
                // console.log('데이터 확인: ', res.data.currentPage);
                // console.log(res);
                console.log('detail 데이터 : ' + res.data);
                setDetailPostData(res.data);
            });
    }, [id]);

    return (
        <body>
        <div>
            <p>{detailPostData.userRealName}님 ???</p>
            {/*<p>{props.userRealName}님 </p>*/}
        </div>
        <table>
            <tr>
                <th>제목</th>
                <td className="title">{detailPostData.post?.title}</td>
            </tr>
            <tr>
                <th>작성자</th>
                <td className="author">{detailPostData.post?.author}</td>
            </tr>
            <tr>
                <th>게시글 내용</th>
                <td className="content" style={{wordWrap: 'break-word'}}>
                    {detailPostData.post?.content}
                    {detailPostData.post?.file_original_name && (
                        <ul style={{listStyleType: 'none', paddingLeft: 0}}>
                            {detailPostData.post.file_original_name.split(';').map((originalName, index) => {
                                const extension = originalName.split('.').pop();
                                if (['jpg', 'jpeg', 'png'].includes(extension)) {
                                    return (
                                        <li style={{textAlign: 'center'}}>
                                            <img
                                                src={`/uploads/${detailPostData.post.file_stored_name.split(';')[index]}`}
                                                alt={originalName} style={{maxWidth: '100%', height: 'auto'}}/>
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ul>
                    )}
                </td>
            </tr>
            <tr>
                <th>생성일</th>
                <td>{detailPostData.post?.created_at}</td>
            </tr>
            <tr>
                <th>조회수</th>
                <td>{detailPostData.post?.views}</td>
            </tr>
            <tr>
                <th>좋아요 수</th>
                <td>{detailPostData.post?.likes}</td>
            </tr>
        </table>
        <div className="attachment-section center">
            <div className="attachment-header">첨부 파일</div>
            {detailPostData.post?.file_original_name ? (
                <ul style={{listStyleType: 'none', paddingLeft: 0}}>
                    {detailPostData.post.file_original_name.split(';').map((originalName, index) => (
                        <li style={{textAlign: 'center'}}>
                            <a href={`/uploads/${detailPostData.post.file_stored_name.split(';')[index]}`}
                               download={originalName}>
                                {originalName}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>첨부된 파일이 없습니다.</p>
            )}
        </div>

        {/* 댓글 섹션은 주석 처리 */}
        {/* <CommentSection comments={detailPostData.comments} postId={detailPostData.post?.id} userId={detailPostData.userId} /> */}

        {/*<div className="center">*/}
        {/*    <a href="/" className="button">이전 페이지로 돌아가기</a>*/}
        {/*    <a href={`/editPost/${detailPostData.post?.id}`} className="button">수정</a>*/}
        {/*    <a href={`/deletePost/${detailPostData.post?.id}`} className="button">삭제</a>*/}
        {/*</div>*/}
        <div>
            <Link to="/" className="button">이전 페이지로 돌아가기</Link>
            <Link to={`/editPost/${detailPostData.post?.id}`} className="button">수정</Link>
            <Link to={`/deletePost/${detailPostData.post?.id}`} className="button">삭제</Link>
        </div>
        </body>
    );
}

export default DetailPost;
