import React from 'react';
import styles from './modal.module.css';

// 모달의 오버레이나 백그라운드 클릭시 모달 닫기
function Modal({ isOpen, children }) {
    return (
        <div className={isOpen ? "modal-overlay visible" : "modal-overlay"}>
            <div className="modal-content">
                {children}
            </div>
        </div>
    );
}


export default Modal;