import {React, useState} from 'react';
import styles from './statistics.module.css'
import axios from "axios";
import NationalGasPricesChart from './NationalGasPricesChart.js';
import NearbyGasChart from './NearbyGasChart.js';
import EV_ChargingSlots from './EV_ChargingSlots.js'
import Chart7 from "./Chart7";


function Statistics() {
    //
    // let[oilPrice,setOilPrice] = useState('주유가격')
    // let[oilPrice1,setOilPrice1] = useState('주유가격')

    return (
        <>
            <div className={styles.statistics}>
                <div className={styles.box1}>
                    <div className={styles.smallbox1}>
                        <button onClick={
                            () => {
                                axios.get('http://localhost:5000/oill')
                                    // 응답을 then의 콜백함수로 받을수 있다.
                                    // 받은 데이터는 인자를 임의로 작명하여 확인 가능
                                    .then((response) => {
                                        // console.log(response)  // 전체 데이터
                                        // console.log(response.data) // 실 데이터
                                        // [[배열 요소1], [배열요소2]] ==> 하나의 배열로 병합
                                        // concat등의 메소드 활용가능
                                        let shoesCopy = response.data
                                        // 추가 작업
                                        console.log(shoesCopy)
                                        // return setOilPrice(shoesCopy[0].PRICE)
                                        // 리턴값을 set변수  를 바꿔서  useState를 이용할수있께 해야함

                                    })
                                    // 응답에 실패한 경우, 예외처리 코드 정의
                                    .catch(() => {
                                        console.log('실패함');
                                    })
                            }
                        }> (OpenApi자료) 파이참 oill 데이터 키면 콘솔에 데이터가 한글로 찍힘
                        </button>


                    </div>
                </div>
                {/*<div className={styles.box2}>*/}
                {/*    <div className={styles.smallbox2}>*/}
                {/*        <NationalGasPricesChart/>*/}
                {/*        <div className={styles.smallbox3}>*/}
                {/*            <EV_ChargingSlots/>*/}
                {/*            /!*<NearbyGasChart/>*!/*/}
                {/*        </div>*/}

                {/*            <button onClick={*/}
                {/*                () => {*/}
                {/*                    axios.get('http://localhost:5000/oill')*/}
                {/*                        .then((response) => {*/}
                {/*                            let shoesCopy = response.data*/}
                {/*                            return setOilPrice(shoesCopy[0].PRICE)*/}
                {/*                        })*/}
                {/*                        .catch(() => {*/}
                {/*                            console.log('실패함');*/}
                {/*                        })*/}
                {/*                }*/}
                {/*            }>고급휘발유*/}
                {/*            </button>*/}
                {/*            고급 휘발유 가격: {oilPrice}*/}
                {/*            <br/>*/}

                {/*            <button onClick={*/}
                {/*                () => {*/}
                {/*                    axios.get('http://localhost:5000/oill')*/}
                {/*                        .then((response) => {*/}
                {/*                            let shoesCopy = response.data*/}
                {/*                            return setOilPrice1(shoesCopy[1].PRICE)*/}
                {/*                        })*/}
                {/*                        .catch(() => {*/}
                {/*                            console.log('실패함');*/}
                {/*                        })*/}
                {/*                }*/}
                {/*            }>휘발유*/}
                {/*            </button>*/}
                {/*            휘발유 가격: {oilPrice1}*/}


                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className={styles.box3}>*/}
                {/*</div>*/}
                <div className={styles.box2}>
                    <div className={styles.chartContainer}>
                        <div className={styles.smallbox2}>
                            <NationalGasPricesChart/>
                        </div>
                        <div className={styles.smallbox3}>
                            <EV_ChargingSlots/>
                        </div>

                        <div className={styles.smallbox2}>
                            <Chart7/>
                        </div>
                        <div className={styles.smallbox3}>
                            <NearbyGasChart/>
                        </div>
                    </div>
                </div>


            </div>

        </>
    )
}


export default Statistics

