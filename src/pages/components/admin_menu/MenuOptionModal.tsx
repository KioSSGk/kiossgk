import React from 'react';

interface MenuOptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
}

const MenuOptionModal: React.FC<MenuOptionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">메뉴 옵션 모달!</h2>
                <button className="mt-4 p-2 bg-orange-400 text-white rounded" onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default MenuOptionModal;
