import React from 'react';

interface MenuListProps {
    items: any[];
    onEdit: (item: any) => void;
    onDelete: (id: number) => void;
    onOption: (item: any) => void; // 새로운 버튼을 위한 함수 prop 추가
}

const MenuList: React.FC<MenuListProps> = ({ items, onEdit, onDelete, onOption }) => {
    return (
        <div>
            {items.map(item => (
                <div key={item.id} className='flex py-6 justify-center'>
                    <div className='flex p-6 justify-center bg-white rounded-2xl border outline-gray-500' style={{ width: '1200px', borderWidth: '2px' }}>
                        <div className='px-4'>
                            <img src={URL.createObjectURL(item.image)} alt={item.name} style={{ width: '120px', height: '120px' }} />
                        </div>
                        <div className='m-4 w-32 h-24'>
                            <div className='m-2 pb-4'>
                                <strong>메뉴 이름</strong>
                            </div>
                            <div className='m-2 pt-4'>
                                <span>{item.name}</span>
                            </div>
                        </div>
                        <div className='m-4 w-32 h-24'>
                            <div className='m-2 pb-4'>
                                <strong>가격</strong>
                            </div>
                            <div className='m-2 pt-4'>
                                <span>{item.price}</span>
                            </div>
                        </div>
                        <div className='m-4 w-32 h-24'>
                            <div className='m-2 pb-4 '>
                                <strong>설명</strong>
                            </div>
                            <div className='m-2 pt-4 overflow-hidden text-ellipsis whitespace-nowrap'>
                                <span>{item.description}</span>
                            </div>
                        </div>
                        <div className='m-4 w-32 h-24'>
                            <div className='m-2 pb-4'>
                                <strong>카테고리</strong>
                            </div>
                            <div className='m-2 pt-4'>
                                <span>{item.category}</span>
                            </div>
                        </div>
                        <div className='m-4 w-32 h-24'>
                            <div className='m-2 pb-4'>
                                <strong>상태</strong>
                            </div>
                            <div className='m-2 pt-4'>
                                <span>{item.status}</span>
                            </div>
                        </div>
                        <div className='p-4'>
                            <div className='flex flex-col items-center space-y-2'>
                                <button className='p-2 mb-2 bg-orange-400 font-bold text-white rounded' onClick={() => onEdit(item)}>수정하기</button>
                                <button className='p-2 bg-orange-400 font-bold text-white rounded' onClick={() => onDelete(item.id)}>삭제하기</button>
                            </div>
                        </div>
                        <div className='p-4'>
                            <button className='p-2 bg-orange-400 font-bold text-white rounded' onClick={() => onOption(item)}>메뉴 옵션</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuList;
