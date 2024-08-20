import React, { useState } from 'react';
import { MenuOption } from '@/types/menuOption';
interface MenuOptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    onSaveOption: (itemId: any, option:MenuOption ) => void; // 옵션 저장 함수 prop 추가
}

const MenuOptionModal: React.FC<MenuOptionModalProps> = ({ isOpen, onClose, item, onSaveOption }) => {
    const [option, setOption] = useState({    
        option_idx: 0,
        menu_idx:0,
        options: '',
        price: 0,
        status: 'available' 
       
    });
    // 입력 필드의 값이 변경될 때 상태를 업데이트하는 함수
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOption((prevOption) => ({
            ...prevOption,
            [name]: name === 'price' ? parseInt(value, 10) : value, // 가격 필드는 숫자로 변환하여 저장
        }));
    };

    // 드롭다운에서 옵션 상태가 변경될 때 상태를 업데이트하는 함수
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setOption((prevOption) => ({
            ...prevOption,
            status: value, // 상태 값을 업데이트
        }));
    };
    if (!isOpen) return null;
    console.log("눌린 아이템 번호",item.menu_idx);
    const handleSaveOption = () => {
        // const option:MenuOption;
        //onSaveOption(item.id, option);
        onSaveOption(item.menu_idx,option);
        console.log("모달위 아이템 후",item.menu_idx);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">메뉴 옵션 추가</h2>

                {/* 옵션 이름 입력 필드 */}
                <input
                    type="text"
                    name="options"
                    placeholder="옵션 이름"
                    value={option.options}
                    onChange={handleInputChange}
                    className="mb-2 p-2 border rounded w-full"
                />

                {/* 옵션 가격 입력 필드 */}
                <input
                    type="number"
                    name="price"
                    placeholder="옵션 가격"
                    value={option.price}
                    onChange={handleInputChange}
                    className="mb-2 p-2 border rounded w-full"
                />

                {/* 옵션 상태 선택 드롭다운 */}
                <select
                    name="status"
                    value={option.status}
                    onChange={handleStatusChange}
                    className="mb-2 p-2 border rounded w-full"
                >
                    <option value="available">주문 가능</option>
                    <option value="unavailable">주문 불가</option>
                </select>

                {/* 저장 버튼 */}
                <button
                    className="mt-4 p-2 bg-orange-400 text-white rounded w-full"
                    onClick={handleSaveOption}
                >
                    저장
                </button>

                {/* 닫기 버튼 */}
                <button
                    className="mt-4 p-2 bg-gray-400 text-white rounded w-full"
                    onClick={onClose}
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default MenuOptionModal;
