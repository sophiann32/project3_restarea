import React from 'react';
import './Modal.module.css';

function ChatModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal show">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>챗봇 대화창</h2>
                {/* 이곳에 챗봇 컴포넌트를 포함시킵니다. */}
            </div>
        </div>
    );
}

export default ChatModal;
