import {React,useState,useEffect} from 'react';
import My_location from "../kako_map/my_location";

import styles from './map_ui.module.css'
import ChangeOverlay2 from "../kako_map/map_type";
import MapInfo from "../kako_map/map_info";


function MapUi() {

    let[list1,setList1] = useState(1)
    let[list2,setList2] = useState(false)
    let testList = [1,2,3,4,5,]
    // console.log(testList)
    return (
        <>
            <div id={styles.change}>
                <aside className={styles.aside}>

                    <button id={styles.list1} onClick={
                        () => {
                            setList1(1)
                        }
                    }></button>
                    <button id={styles.list1} onClick={
                        () => {
                            setList1(2)
                        }
                    }></button>
                    <button id={styles.list1} onClick={
                        () => {
                            setList1(3)
                        }
                    }></button>


                </aside>
                {/*<section className={styles.section}><My_location/></section>*/}
                {/*////////////////////////////////////////////////////////////////////////*/}
                {
                    list1 == 1 ? <section className={styles.section}><My_location/></section> :
                        list1 == 2 ? <section className={styles.section}><ChangeOverlay2/></section> :
                            <section className={styles.section}><MapInfo/></section>
                }









            </div>

        </>
    )
}

// function MapUiList1() {
//     return (
//         <>
//         <div id={styles.list}>
//                 근처 주유소 찾기
//
//             </div>
//
//         </>
//     )
// }


export default MapUi