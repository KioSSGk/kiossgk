import React, { useState } from 'react';

interface PhoneNumberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSavePhoneNumber: (phoneNumber: string) => void; // 여기서 onPhoneNumberSubmit을 onSavePhoneNumber로 수정
}

const PhoneNumberModal: React.FC<PhoneNumberModalProps> = ({ isOpen, onClose, onSavePhoneNumber }) => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handleSubmit = () => {
        const phoneRegex = /^01([0|1|6|7|8|9])-?(\d{3,4})-?(\d{4})$/;
        if (phoneRegex.test(phoneNumber)) {
            onSavePhoneNumber(phoneNumber); // 이 부분도 동일하게 수정
            
            onClose();
        } else {
            alert('유효한 전화번호를 입력해주세요.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">전화번호 입력</h2>
                <input
                    type="text"
                    placeholder="010-1234-5678"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    className="mb-2 p-2 border rounded w-full"
                />
                <button
                    className="mt-4 p-2 bg-orange-400 text-white rounded w-full"
                    onClick={handleSubmit}
                >
                    확인
                </button>
                <button
                    className="mt-4 p-2 bg-gray-400 text-white rounded w-full"
                    onClick={onClose}
                >
                    취소
                </button>
            </div>
        </div>
    );
};

export default PhoneNumberModal;
