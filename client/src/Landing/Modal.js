import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ onClose, videoUrl }) => {
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent}>
                <video autoPlay controls className={styles.modalVideo}>
                    <source src={videoUrl} type="video/mp4" />
                </video>
            </div>
        </div>
    );
};

export default Modal;
