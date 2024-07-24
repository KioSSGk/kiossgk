// src/components/Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                backgroundColor: 'black', padding: '20px', // 배경색을 검정색으로 설정
                borderRadius: '5px', width: '500px', maxWidth: '100%', color: 'white'
            }}>
                <button onClick={onClose} style={{ float: 'right', color: 'white' }}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
