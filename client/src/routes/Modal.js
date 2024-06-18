import React from 'react';
import styles from'./Modal.module.css';
import Chatbot from '../chatbot/chat';

function ChatModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modal_show}>
            <Chatbot onClose={onClose} />
            <div className={styles.modal_content}>
            </div>
        </div>
    );
}

export default ChatModal;
