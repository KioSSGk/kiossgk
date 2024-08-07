
// src/components/admin_menu/MenuList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { JwtPayload } from 'jwt-decode';
import useAuth from '@/lib/useAuth';

// 데이터베이스에서 불러온 데이터 형식
interface DBMenuItem {
    menu_idx: number;
    store_idx: number;
    menu_name: string;
    menu_price: number;
    menu_detail: string;
    menu_category: string;
    menu_status: string;
}

// 컴포넌트에서 사용하는 데이터 형식
interface MenuItem {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    status: string;
    image: string; // Assuming image is a URL or base64 encoded string
}

interface User extends JwtPayload{
id:string,
email:string
}

interface MenuListProps {
    onEdit: (item: MenuItem) => void;
    onDelete: (id: number) => void;
    onOption: (item: MenuItem) => void;
    adminId: number;
}

const MenuList: React.FC<MenuListProps> = ({ onEdit, onDelete, onOption, adminId }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    //const { user } = useAuth(); // useAuth 훅을 컴포넌트 내부에서 호출

    useEffect(() => {
        const fetchMenuItems = async () => {
            // if (!user) {
            //     console.error('User is not authenticated');
            //     return;
            // }
            try {
                console.log("admin Id list:",adminId);
                // const user = useAuth(); 
                // console.log(user);
                const response = await axios.post('/api/admin_menu_api/menu',{storeId:adminId});
                const dbMenuItems: DBMenuItem[] = response.data;
                //const user = useAuth(); 
                //console.log(user);
                // 데이터 변환
                const transformedMenuItems: MenuItem[] = dbMenuItems.map(item => ({
                    id: item.menu_idx,
                    name: item.menu_name,
                    price: item.menu_price,
                    description: item.menu_detail,
                    category: item.menu_category,
                    status: item.menu_status,
                    image: '', // 이미지 URL을 데이터베이스에서 가져오지 않는 경우 빈 문자열 또는 기본 이미지 URL 설정
                }));

                setMenuItems(transformedMenuItems);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    return (
        <div>
            {menuItems.map(item => (
                <div key={item.id} className='flex py-6 justify-center'>
                    <div className='flex p-6 justify-center bg-white rounded-2xl border outline-gray-500' style={{ width: '1200px', borderWidth: '2px' }}>
                        <div className='px-4'>
                            <img src={item.image} alt={item.name} style={{ width: '120px', height: '120px' }} />
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
                            <div className='p-2 mb-3 bg-orange-400 font-bold text-white rounded'>
                                <button className='rounded-2xl m-1' onClick={() => onEdit(item)}>수정하기</button>
                            </div>
                            <div className='p-2 mt-3 bg-orange-400 font-bold text-white rounded'>
                                <button className='rounded-2xl m-1' onClick={() => onDelete(item.id)}>삭제하기</button>
                            </div>
                            <div className='p-2 mt-3 bg-orange-400 font-bold text-white rounded'>
                                <button className='rounded-2xl m-1' onClick={() => onOption(item)}>메뉴 옵션</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuList;
