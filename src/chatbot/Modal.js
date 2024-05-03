import React, { useState } from 'react';
import styles from './Modal.module.css'; // 모달에 대한 CSS 스타일

function Modal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>챗봇</h2>
                <p>여기에 챗봇 내용을 넣으세요.</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}

export default Modal;
