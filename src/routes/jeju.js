import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './jeju.module.css';
import JejuMap from '../kako_map/jejuMap';

function Jeju(){
    useEffect(() => {
        axios.get('/api/charging-stations-jeju')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    return (
        <>
            <div id={styles.mainJ}>
                <div className={styles.jejuTab}></div>
                <section className={styles.jejuMap}>
                    <JejuMap></JejuMap>
                </section>
            </div>
        </>
    );
}

export default Jeju;
