import React from 'react';
import styles from './main_page.module.css'


function MainPage(){
    return(
        <>
            <div className={styles.main_page}>메인페이지
                <form>
                    <fieldset>
                        <legend>고속도로</legend>
                        <ul>
                            <li>
                                <label className="reg" htmlFor="class">고속도로</label>
                                <select size="6" id="class" multiple>
                                    <option value="1">중부선</option>
                                    <option value="2">호남선</option>
                                    <option value="3">서해안선</option>
                                    <option value="4">중부내륙선</option>
                                    <option value="5" selected>경부선</option>
                                    <option value="6">남해선</option>
                                </select>
                            </li>
                        </ul>
                    </fieldset>
                    <div className={styles.gg} >

                            <legend>고속도로</legend>
                            <ul>
                                <li className="reg">
                                    <label className="reg" htmlFor="class">고속도로</label>
                                    <select size="6" id="class" multiple>
                                        <option value="1">중부선</option>
                                        <option value="2">호남선</option>
                                        <option value="3">서해안선</option>
                                        <option value="4">중부내륙선</option>
                                        <option value="5" selected>경부선</option>
                                        <option value="6">남해선</option>
                                    </select>
                                </li>
                            </ul>

                    </div>
                    <fieldset>
                        <legend>고속도로</legend>
                        <ul>
                            <li>
                                <label className="reg" htmlFor="class">고속도로</label>
                                <select id="class">
                                    <optgroup label="좀 긴거">
                                        <option value="1">중부선</option>
                                        <option value="2">호남선</option>
                                        <option value="3">서해안선</option>
                                        <option value="4">중부내륙선</option>
                                        <option value="5" selected>경부선</option>
                                        <option value="6">남해선</option>
                                    </optgroup>
                                    <optgroup label="짧은거">
                                        <option value="a">중부내륙선</option>
                                        <option value="b">수도권제1순환선</option>
                                        <option value="c">중앙선</option>
                                        <option value="d">동해선</option>
                                        <option value="e" selected>순천완주선</option>
                                        <option value="f">대구포항선</option>
                                    </optgroup>
                                </select>
                            </li>
                        </ul>
                    </fieldset>
                    <fieldset>
                        <legend>고속도로 골라봐</legend>
                        <ul>
                            <li>
                                <span className="reg">고속도로</span>
                                <label htmlFor="interest"></label>


                                <input type="text" id="interest" list="choices"/>
                                <datalist id="choices">
                                    <option value="중부선">40개</option>
                                    <option value="호남선">50개</option>
                                    <option value="서해안선">60개</option>
                                    <option value="중부내륙선">20개</option>
                                    <option value="경부선">10개</option>
                                </datalist>
                            </li>
                        </ul>
                    </fieldset>
                </form>
            </div>


        </>


    )
}

export default MainPage