// RestAreaModalContent.js
import React from 'react';

function RestAreaModalContent({ area }) {
    return (
        <div>
            <h2>{area.휴게소명}</h2>
            {area.fuelPrices && (
                <>
                    <h3>연료 가격 정보</h3>
                    <p>휘발유 가격: {area.fuelPrices.gasolinePrice}원</p>
                    <p>경유 가격: {area.fuelPrices.diselPrice}원</p>
                    <p>LPG 가격: {area.fuelPrices.lpgPrice !== 'X' ? `${area.fuelPrices.lpgPrice}원` : 'LPG 미판매'}</p>
                    <p>전화번호: {area.fuelPrices.telNo}</p>
                </>
            )}
            {area.brandInfo && (
                <>
                    <h3>브랜드 정보: {area.brandInfo.brdName}</h3>
                    <p>영업시간: {`${area.brandInfo.stime} ~ ${area.brandInfo.etime}`}</p>
                    <p>브랜드 소개: {area.brandInfo.brdDesc}</p>
                    <p>최종 수정 일시: {area.brandInfo.lsttmAltrDttm}</p>
                </>
            )}

            {area.bestFoods && area.bestFoods.length > 0 && (
                <>
                    <h3>인기 음식</h3>
                    {area.bestFoods.map((food, index) => (
                        <p key={index}>{food.foodNm} - {food.foodCost}원 (업데이트: {food.lsttmAltrDttm})</p>
                    ))}
                </>
            )}
        </div>
    );
}

export default RestAreaModalContent;
