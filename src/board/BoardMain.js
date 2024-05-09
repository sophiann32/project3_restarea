import React, { useState, useEffect } from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom'; // React Router가 필요합니다.
import axios from "axios";
import styles from './Board.module.css'
function Board({ userRealName, posts, startPage, currentPage, endPage, totalPages, MAX_PAGE_LIMIT }) {
    const [sortByViews, setSortByViews] = useState(false);
    const navigate = useNavigate()
    // let respones;
    // let posts;
    // let[respones,setRespones] =useState([])
    const [responseData, setResponseData] = useState({
        currentPage: 0,
        posts: [],
        endPage: 0,
        maxPageNumber: 0,
        startPage: 0,
        totalPages:0

        // other properties 초기값 설정
    });

    ///////////////////////////////
    ///////////////////////////////////
    const { page } = useParams();
///////////////////////////////////////////
    //////////////////////////////////////

    const maxPageNumber = 5;

    ////////
    useEffect(()=>{
        // const urlParams  = new URLSearchParams(window.location.search);
        // const reqData ={
        //     params: {
        //         searchType : urlParams.get("searchType"),
        //         searchInput : urlParams.get("searchInput")
        //     }
        // }

        // console.log(reqData)
        // axios.get('http://localhost:3001/boardMain', reqData)
        axios.get('http://localhost:3001/boardMain')
            .then(res=>{
                console.log('데이터확인 : '+ res.data.currentPage)
                console.log(res)
                console.log(res.data)
                setResponseData(res.data)
                // respones = res.data.posts
                // console.log(respones)
            })
    },[])
    ////////



    ///////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////





    useEffect(() => {
        axios.get(`http://localhost:3001/boardMain?page=${page}` )
            .then(response => {
                setResponseData({
                    ...responseData,
                    posts: response.data.posts,
                    currentPage: parseInt(page),
                    totalPages: response.data.totalPages,
                    startPage: response.data.startPage,
                    endPage: response.data.endPage
                });
            })
            .catch(error => {
                console.log('Error fetching data:', error);
            });
    }, [page]);


/////////////////////////////////////////////
//////////////  검색내용 보내는코드 gpt한테 받은거///////////////////////////////
    useEffect(() => {
        axios.get('http://localhost:3001/boardMain', {
            params: {
                param1: 'searchType',
                param2: 'searchInput',
                // 필요한 만큼 쿼리 파라미터를 추가할 수 있습니다.
            }
        })
            .then(res => {
                console.log('데이터확인 : ' + res.data.currentPage);
                console.log(res);
                console.log(res.data);
                setResponseData(res.data);
            })
            .catch(error => {
                console.error('에러 발생: ', error);
            });
    },[])



/////////////////////////////////////////////
/////////////////////////////////////////////


    // useEffect(() => {
    //     const queryParams = new URLSearchParams(window.location.search);
    //     const sortParam = queryParams.get('sort');
    //
    //     if (sortParam === 'views_desc') {
    //         setSortByViews(true);
    //     }
    // }, []);

    // const toggleSort = () => {
    //     setSortByViews(!sortByViews);
    //     const sortParam = sortByViews ? 'views_desc' : '';
    //     window.location.href = `/boardMain?sort=${sortParam}`;
    // };

    return (
        <div>
            <h1>리뷰 게시판</h1>
            <div style={{position: 'absolute', top: '10px', right: '10px',color:"white"}}>
                {userRealName ? (
                    <p>
                        {/*{userRealName}님 환영합니다. &nbsp;&nbsp;*/}
                        <a href="/" className="button"  style={{color:"white"}}>로그아웃</a>
                        {/*a 태그로 이동하면 seasion끊기는거 이용*/}
                    </p>
                ) : (''
                    // <a href="/" className="button">로그인</a>
                )}
            </div>


            {/*///////////////////////////////*/}

            <table>
                <thead>
                <tr>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    {/*<th onClick={toggleSort} onMouseOver={(e) => e.target.style.textDecoration = 'underline'}*/}
                    {/*    onMouseOut={(e) => e.target.style.textDecoration = 'none'}>조회수 ▼*/}
                    {/*</th>*/}
                    <th>조회수 ▼</th>
                    {/*위에꺼를  단순하게 한거 정렬 안되게*/}
                </tr>
                </thead>
                <tbody>
                {responseData.posts.map((post, index) => (
                    <tr key={index}>
                        <td><Link to={`/detailPost/${post[0]}`} className={styles.postLink}>{post[1]} [{post[6]}]</Link></td>
                        {/*/////////////////////////////////////////////*/}
                        {/*<td className={styles.postLink}>{post[1]} [{post[6]}]</td>*/}
                        {/*////////////////////////////*/}
                        {/*<td><a onClick={()=>{*/}
                        {/*    navigate(`/detailPost/${post[0]}`)*/}
                        {/*}}>이동</a> </td>*/}
                        <td>{post[2]}</td>
                        <td>{post[3]}</td>
                        <td>{post[4]}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/*////////////////////////////////*/}


            <div className={styles.buttonContainer}>
                {userRealName && <Link to="/create" className="button">글쓰기</Link>}
            </div>

            {/*//////////////////////////////////////*/}
            {/*<div className={styles.pagingContainer}>*/}
            {/*    {responseData.currentPage > 1 && <Link to={`/boardMain?page=${responseData.currentPage - 1}`}>이전</Link>}*/}
            {/*    {Array.from({ length: responseData.endPage - responseData.startPage + 1 }, (_, i) => responseData.startPage + i).map((page, index) => (*/}
            {/*        <React.Fragment key={index}>*/}
            {/*            {page === responseData.currentPage ? (*/}
            {/*                <span className="current-page">{page}</span>*/}
            {/*            ) : (*/}
            {/*                <Link to={`/boardMain?page=${page}`}>{page}</Link>*/}
            {/*            )}*/}
            {/*        </React.Fragment>*/}
            {/*    ))}*/}
            {/*    {(responseData.totalPages - responseData.currentPage + 1) > MAX_PAGE_LIMIT && <Link to={`/boardMain?page=${responseData.currentPage + 1}`}>다음</Link>}*/}
            {/*</div>*/}


            {/*//////////////// /boardMain/?page=  ////////////////////////////////////*/}
            {/*<div className={styles.pagingContainer}>*/}
            {/*    {responseData.currentPage > 1 && (*/}
            {/*        <Link to={`/boardMain/?page=${responseData.currentPage - 1}`}>이전</Link>*/}
            {/*    )}*/}

            {/*    {Array.from({length: responseData.endPage - responseData.startPage + 1}, (_, i) => responseData.startPage + i).map((page) => (*/}
            {/*        page === responseData.currentPage ? (*/}
            {/*            <span className="current-page" key={page}>{page}</span> //페이지 번호가 현재 페이지면 링크안달고*/}
            {/*        ) : (*/}
            {/*            <Link to={`/boardMain/?page=${page}`} key={page}>{page}</Link>  //페이지 번호가 현재 페이지가 아니면 링크담*/}
            {/*        )*/}
            {/*    ))}*/}

            {/*    {responseData.totalPages - responseData.currentPage + 1 > responseData.maxPageNumber && (*/}
            {/*        <Link to={`/boardMain/?page=${responseData.currentPage + 1}`}>다음</Link>*/}
            {/*    )}*/}
            {/*</div>*/}

            {/*////////////////  Link to={`/boardMain/${page}  ////////////////////////////////////////////////////////////*/}

            <div className={styles.pagingContainer}>
                {responseData.currentPage > 1 && (
                    <Link to={`/boardMain/${responseData.currentPage - 1}`}>이전</Link> // 이전 페이지 링크 수정
                )}

                {Array.from({length: responseData.endPage - responseData.startPage + 1}, (_, i) => responseData.startPage + i).map((page) => (
                    page === responseData.currentPage ? (
                        <span className="current-page" key={page}>{page}</span> // 현재 페이지는 링크 없음
                    ) : (
                        <Link to={`/boardMain/${page}`} key={page}>{page}</Link> // 페이지 번호를 경로의 일부로 사용
                    )
                ))}

                {responseData.totalPages - responseData.currentPage + 1 > responseData.maxPageNumber && (
                    <Link to={`/boardMain/${responseData.currentPage + 1}`}>다음</Link> // 다음 페이지 링크 수정
                )}
            </div>


            {/*///////////////////////////////////////////////////////*/}


            {/*<div id={styles.searchContainer}>*/}
            {/*    <form action="/boardMain" method="GET">*/}
            {/*    /!*    <form action="http://localhost:3001/boardMain" method="post">*!/*/}
            {/*            <label htmlFor="searchType">검색 조건:</label>*/}
            {/*            <select id="searchType" name="searchType">*/}
            {/*                <option value="title" selected>제목</option>*/}
            {/*                <option value="content">게시글 내용</option>*/}
            {/*                <option value="author">글 작성자</option>*/}
            {/*            </select>*/}
            {/*            <input type="text" id="searchInput" name="searchInput"/>*/}
            {/*            <button type="submit">검색</button>*/}
            {/*        </form>*/}
            {/*</div>*/}
            {/*/////////////////////////////////////*/}
        </div>
    );
}

export default Board;