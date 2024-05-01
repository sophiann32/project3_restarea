function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            zIndex: 1000,
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '80%',
            maxHeight: '80%',
            overflowY: 'auto'
        }}>
            <button onClick={onClose} style={{
                position: 'absolute',
                width:'50px',
                height:'30px',
                right: '10px',
                top: '10px',
                cursor: 'pointer',
            }}>닫기</button>
            {children}
        </div>
    );
}
export default Modal;