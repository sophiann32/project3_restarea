import React from 'react';
import './Modal.module.css';
import Chatbot from '../chatbot/chat';
function ChatModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal_show">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2><Chatbot/></h2>
                {/* 이곳에 챗봇 컴포넌트를 포함시킵니다. */}
            </div>
        </div>
    );
}

export default ChatModal;
