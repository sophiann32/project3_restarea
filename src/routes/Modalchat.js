import React from 'react';
import styles from './modal.module.css';
function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContent}>
                <button onClick={onClose}>닫기</button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
