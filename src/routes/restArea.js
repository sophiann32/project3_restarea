import React from 'react';
import styles from './restArea.module.css';
import RestAreaDetail from "../kako_map/restAreaDetail"; // 올바른 경로와 이름으로 임포트

function RestArea() {
    return (
        <>
            <div id={styles.main}>

                <div className={styles.restAreaTab}>
                    {/* RestAreaDetail 컴포넌트를 렌더링합니다 */}
                </div>
                <section className={styles.restAreaMap}><RestAreaDetail /></section>
            </div>
        </>
    );
}

export default RestArea;
