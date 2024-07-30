import React, { useState } from 'react';

interface MenuOptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    onSaveOption: (itemId: number, option: any) => void; // 옵션 저장 함수 prop 추가
}

const MenuOptionModal: React.FC<MenuOptionModalProps> = ({ isOpen, onClose, item, onSaveOption }) => {
    const [optionName, setOptionName] = useState('');
    const [optionPrice, setOptionPrice] = useState('');

    if (!isOpen) return null;

    const handleSaveOption = () => {
        const option = { name: optionName, price: optionPrice };
        onSaveOption(item.id, option);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">메뉴 옵션 모달!</h2>
                <input
                    type="text"
                    placeholder="옵션 이름"
                    value={optionName}
                    onChange={(e) => setOptionName(e.target.value)}
                    className="mb-2 p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="옵션 가격"
                    value={optionPrice}
                    onChange={(e) => setOptionPrice(e.target.value)}
                    className="mb-2 p-2 border rounded"
                />
                <button className="mt-4 p-2 bg-orange-400 text-white rounded" onClick={handleSaveOption}>
                    저장
                </button>
                <button className="mt-4 p-2 bg-orange-400 text-white rounded" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default MenuOptionModal;
