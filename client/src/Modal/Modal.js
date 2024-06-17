import React from 'react';
import styles from './Modal.module.css';
import { IoClose } from "react-icons/io5";

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <IoClose size={24} />
                </button>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </>
    );
}

export default Modal;