import {React,useState} from 'react';
import styles from './statistics.module.css'
import axios from "axios";




function Statistics(){

    let[oilPrice,setOilPrice] = useState('이름')
    let[oilPrice1,setOilPrice1] = useState('주유가격')

    return(
        <>
            <div className={styles.statistics}>
                <div className={styles.box1}>
                    {/*<div className={styles.smallbox1}>*/}
                    <div className="Bento" style={{}}>
                    <div className="Frame" style={{}}/>
                    <div className="Frame" style={{}}/>
                    <div className="Frame" style={{}}/>
                    <div className="Frame" style={{}}/>
                    </div>
                </div>
                <div className={styles.box2}>
                <div className={styles.smallbox2}>

                        <button onClick={
                            () => {
                                axios.get('http://localhost:5000/api/Search')
                                    .then((response) => {
                                        let shoesCopy = response.data
                                        return setOilPrice(shoesCopy[0].GIS_X_COOR)


                                    })
                                    .catch(() => {
                                        console.log('실패함');
                                    })
                            }
                        }>위치
                        </button>
                        고급 휘발유 가격: {oilPrice}
                        <br/>

                        <button onClick={
                            () => {
                                axios.get('http://localhost:5000/oill')
                                    .then((response) => {
                                        let shoesCopy = response.data
                                        return setOilPrice1(shoesCopy[1].PRICE)
                                    })
                                    .catch(() => {
                                        console.log('실패함');
                                    })
                            }
                        }>휘발유
                        </button>
                        휘발유 가격: {oilPrice1}


                    </div>

                </div>
                <div className={styles.box3}>
                    <div className={styles.smallbox3}></div>

                </div>

            </div>

        </>
    )
}

export default Statistics

