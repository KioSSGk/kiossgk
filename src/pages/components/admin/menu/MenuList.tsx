import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Menu } from '@/types/menu';
import { useRouter } from 'next/router';
import useAuth from '@/lib/useAuth';

// 데이터베이스에서 불러온 데이터 형식
interface DBMenuItem extends Menu {
  menu_image_path?: string;
}


// 컴포넌트에서 사용하는 데이터 형식
interface MenuItem {
  menu_idx: number;
  store_idx: number;
  menu_name: string;
  menu_price: number;
  menu_detail: string | null;
  menu_category: string;
  menu_status: string;
  image: string; // Assuming image is a URL or base64 encoded string
}

interface MenuListProps {
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onOption: (item: MenuItem) => void;
  adminId?: number;
  storeId: number;
}

const MenuList: React.FC<MenuListProps> = ({ onEdit, onDelete, onOption, adminId }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('/api/admin_menu_api/menu', {
          params: { storeId: adminId }
        });
        const dbMenuItems: DBMenuItem[] = response.data;
        const transformedMenuItems: MenuItem[] = dbMenuItems.map(item => ({
          menu_idx: item.menu_idx,
          store_idx: item.store_idx,
          menu_name: item.menu_name,
          menu_price: item.menu_price,
          menu_detail: item.menu_detail,
          menu_category: item.menu_category,
          menu_status: item.menu_status,
          image: item.menu_image_path || '', // 이미지 URL 설정
        }));
        setMenuItems(transformedMenuItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, [adminId]);

      useEffect(() => {
        if (user === null) {
            router.push('/admin/login');
        }
    }, [user, router]);


    const handleAdminMenuBtnClick = () => {
        const url = `/admin/${(user as any)?.id }/menu`;
        router.push(url);
        //?id=${id}
    };

    const handleAdminPaymenthistoryBtnClick = () => {
        router.push('/admin/paymentHistory');
    };

    return (
        <div className='w-full'>
            <div className='flex py-10'>
                    <div className='flex items-center pr-10'>
                        <div className='flex bg-white p-6 rounded-lg shadow-md' style={{width:'224px'}}>
                            <div className='bg-black' style={{width:'60px', height:'60px'}}/>
                            <button 
                                className='pl-6'
                                // onClick={() => handleButtonClick('현장결제 클릭됨')} 버튼 기능 제작 필요
                            >
                                마이페이지
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center pr-10'>
                        <div className='flex bg-white p-6 rounded-lg shadow-md' style={{width:'224px'}}>
                            <div className='bg-black' style={{width:'60px', height:'60px'}}/>
                            <button 
                                className='pl-6'
                                //onClick={() => handleAdminMenuBtnClick()}
                                //마이페이지가 구현되면 라우팅 연결이 필요합니다.
                            >
                                가게설정
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center pr-10'>
                        <div className='flex bg-white p-6 rounded-lg shadow-md' style={{width:'224px'}}>
                            <div className='bg-black' style={{width:'60px', height:'60px'}}/>
                            <button 
                                className='pl-6'
                                //onClick={() => handleAdminPaymenthistoryBtnClick()}
                                //상품 결제 페이지가 구현되면 라우팅 연결이 필요합니다.
                            >
                                상품결제
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center pr-10'>
                        <div className='flex bg-white p-6 rounded-lg shadow-md' style={{width:'224px'}}>
                            <div className='bg-black' style={{width:'60px', height:'60px'}}/>
                            <button 
                                className='pl-6'
                                onClick={() => handleAdminMenuBtnClick()}
                            >
                                메뉴관리
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <div className='flex bg-white p-6 rounded-lg shadow-md' style={{width:'224px'}}>
                            <div className='bg-black' style={{width:'60px', height:'60px'}}/>
                            <button 
                                className='pl-6'
                                onClick={() => handleAdminPaymenthistoryBtnClick()}
                            >
                                내역관리
                            </button>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between'>
                    {menuItems.map(item => (
                        <div key={item.menu_idx} className='bg-white rounded-lg' style={{width:'400px'}}>
                            <div className='justify-center border outline-gray-500 shadow-md'>
                                <div className='pb-5'>
                                    <img src={item.image} alt={item.menu_name} style={{ width: '400px', height: '340px' }} />
                                </div>
                                <div className='flex justify-between mx-4'>
                                    <div>{item.menu_name}</div>
                                    <div>{item.menu_price}</div>
                                </div>                                                              
                                <div className='flex justify-between items-center mx-4 py-5'>
                                    <div className='p-1 hover:bg-indigo-500 font-bold hover:text-white text-sm rounded'>
                                        <button className='m-1' onClick={() => onEdit(item)}>수정하기</button>
                                    </div>
                                    <div className='p-1 hover:bg-indigo-500 font-bold hover:text-white text-sm rounded'>
                                        <button className='m-1' onClick={() => onDelete(item.menu_idx)}>삭제하기</button>
                                    </div>
                                    <div className='p-1 hover:bg-indigo-500 font-bold hover:text-white text-sm rounded'>
                                        <button className='m-1' onClick={() => onOption(item)}>메뉴 옵션</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
      )}
    

export default MenuList;
