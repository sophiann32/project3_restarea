import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import styles from './jeju.module.css';
import JejuMap from '../kako_map/jejuMap';

function Jeju() {


    const categories = {
        "자연 및 야외 활동":{
            tags:    ["승마", "걷기/등산", "서핑", "캠핑", "낚시", "해양스포츠", "서핑스쿨", "해양레저", "수상레저", "스쿠버다이빙", "다이빙", "마린스포츠", "숲", "숲길", "삼나무길", "둘레길", "섬여행", "해안도로", "등산", "해변", "해수욕장", "족욕", "템플스테이", "목장", "내창트레킹", "산책", "야영장", "트레킹", "산", "동굴", "섬속의섬", "계곡", "포구", "조천", "현무암", "환상자전거도로", "곽지해수욕장"],
            imageUrl: '/img/자연.png'
        },

        "계절 및 기후":{
            tags: ["봄", "가을", "겨울", "여름", "맑음", "흐림", "비", "눈", "비/바람/눈", "안개/흐림"],
            imageUrl: '/img/계절.png'
        },

        "문화 및 예술": {
            tags:  ["공연",
                "미술/박물관",
                "전시",
                "청년",
                "예술",
                "갤러리",
                "전시관",
                "공연장",
                "뮤지컬",
                "연극",
                "예술",
                "전시/행사",
                "미술",
                "체험전시",
                "문화",
                "북카페",
                "스테인글라스",
                "전시",
                "카페",
                "갤러리",
                "저지예술인마을",
                "갤러리"
            ],
            imageUrl:'/img/문화.png',
        },

        "웰니스 및 헬스케어": {
            tags:  ["웰니스",
                "스파",
                "헬스케어",
                "의료관광",
                "요가",
                "플라잉요가",
                "메디컬요가",
                "빈야사요가",
                "하타요가",
                "테랍툴요가",
                "휴식",
                "수치료",
                "목욕탕",
                "노천탕",
                "걷기/휴식"
            ],
            imageUrl:'/img/헬스케어.png',
        },
        "체험 및 학습": {
            tags: ["체험관광", "수제캔디", "염색체험", "공예품", "원데이클래스", "공방", "제주동백수목원", "공연", "공예품", "체험관광", "체험농장", "수제캔디", "염색체험", "원데이클래스", "소이캔들", "디퓨저", "향수", "티라이트", "공예품", "월정", "체험", "스포츠", "해양스포츠", "체험", "공방", "카트", "레이싱", "가죽공방", "핸드메이드", "권총", "클레이", "라이플 사격", "ATV", "전기자전거", "전동킥보드", "다이빙체험", "스쿠버교육", "흑돼지", "필라테스"],
            imageUrl:'/img/체험.png',
        },
        "지역적 특성 및 관광 명소": {
            tags: ["제주", "애월", "유적지", "섬", "유람선", "해변", "해수욕장", "지질공원", "서핑", "서핑스쿨", "문화공간", "수영장", "물놀이", "용천수", "수영장", "물놀이", "용천수", "문화공간", "통일", "역사", "역사", "유적지", "서점", "제주신화", "신화탐방로", "제주해산물", "해산물", "차귀도", "차귀도유람선", "감귤", "감귤따기", "다음", "자연염색", "천연염색", "흑염소", "동물먹이주기", "애견동반", "쉼터", "공원", "해안도로", "애월", "구제주", "중문", "관음사", "한라산", "예래", "서귀포"],
            imageUrl:'img/명소.png',
        },
        "사회적 상호작용": {
            tags: ["가족", "친구", "커플", "청년", "중/장년", "가족여행", "친구", "커플", "체험여행", "노년", "성산", "신풍리"],
            imageUrl:'/img/상호작용.png',
        },
        "건축 및 인프라": {
            tags: ["교회", "공항", "도서관", "공연장", "사찰", "절", "위호텔", "제주국제공항", "공연장", "대극장", "공연", "프라이빗스파", "실내", "실내"],
            imageUrl: '/img/건축.png',
        },
    };



    const [tourismSpots, setTourismSpots] = useState([]);
    const [filteredSpots, setFilteredSpots] = useState([]);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const allTags = [...new Set(Object.values(categories).flatMap(cat => cat.tags))].sort();





    function handleTagChange(event) {
        const value = event.target.value;
        setSelectedTags(prev => [...new Set([...prev, value])].slice(0, 3));
    }

    function removeTag(tagToRemove) {
        setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
    }

    // 카테고리에 따른 필터링 로직
    const handleCategoryChange = (tags) => {
        const newFilteredSpots = tourismSpots.filter(spot =>
            spot.TAG && tags.some(tag => spot.TAG.split(/[,/]+/).includes(tag.trim()))
        );
        setFilteredSpots(newFilteredSpots);
        setSelectedSpot(newFilteredSpots[0] || null);
    };



// 태그 선택에 따른 필터링 로직
    useEffect(() => {
        if (selectedTags.length > 0) {
            const newFilteredSpots = tourismSpots.filter(spot =>
                    spot.TAG && selectedTags.every(tag =>
                        spot.TAG.split(/[,/]+/).some(spotTag => spotTag.trim() === tag)
                    )
            );
            setFilteredSpots(newFilteredSpots);
            setSelectedSpot(newFilteredSpots[0] || null);
        } else {
            setFilteredSpots(tourismSpots);
        }
    }, [selectedTags, tourismSpots]);




    useEffect(() => {
        loadTourismSpots();
        return () => {};
    }, []);

    const loadTourismSpots = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/tourism-spots');
            setTourismSpots(response.data);
            setFilteredSpots(response.data);
            setSelectedSpot(response.data[0]);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching tourism spots data:', error);
            setIsLoading(false);
        }
    };




    return (
        <>
            <div id={styles.mainJ}>
                <div className={styles.jejuTab}>    {/*사이트 왼쪽 리스트 */}
                    <div className={styles.topNav}> {/*셀렉트박스 넣을 칸*/}
                        <div className={styles.tagBox}> {/**/}
                            <select onChange={handleTagChange} value="">
                                <option value="">태그 선택...</option>
                                {allTags.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                            <div className={styles.selectedTags}>
                                {selectedTags.map(tag => (
                                    <span key={tag} className={styles.tag}>
                #{tag}
                                        <button onClick={() => removeTag(tag)}>X</button>
            </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {filteredSpots.map(spot => (
                        <div key={spot.CONTENTS_ID} className={styles.tourList} onClick={() => setSelectedSpot(spot)}>
                            <img src={spot.THUMBNAIL_PATH} alt={spot.TITLE}
                                 style={{width: "350px", height: "300px", borderRadius: "15px"}}/>
                            <div className={styles.tourInfo}>
                                <h3>{spot.TITLE}</h3>
                                <p>{spot.ROAD_ADDRESS}</p>
                                <p>{spot.PHONE_NO}</p>
                                <p>{spot.INTRODUCTION}</p>
                                <div className={styles.tags}>
                                    {spot.TAG ? spot.TAG.split(/[,/]+/).slice(0, 5).map((tag, index) => (
                                        <span key={index} className={styles.tag}>{tag.trim()}</span>
                                    )) : null}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
                <section className={styles.jejuMap}>
                    <JejuMap
                        spots={tourismSpots}
                        filteredSpots={filteredSpots}
                        selectedSpot={selectedSpot}
                        onSelectSpot={setSelectedSpot}
                        categories={categories}
                        onCategoryChange={handleCategoryChange} // 여기서 정의한 함수를 전달
                    />
                </section>
            </div>
        </>
    );
}

export default Jeju;