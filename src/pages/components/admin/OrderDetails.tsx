import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import useAuth from '@/lib/useAuth';

const OrderDetails: React.FC = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const { user } = useAuth();
    const router = useRouter();

    const fetchPayments = async (start: string, end: string) => {
        try {
            const response = await axios.get('/api/admin_payment_history_api/payment-history', {
                params: { startDate: start, endDate: end }
            });
            setPayments(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching payment history:', error);
            setError('결제 내역을 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        // 초기 데이터 로드
        fetchPayments('2024-07-01', '2024-07-31');
    }, []);

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

    const handleSearch = () => {
        if (startDate && endDate) {
            fetchPayments(startDate, endDate);
        } else {
            setError('날짜 범위를 선택하세요.');
        }
    };

    const handleAdminPaymenthistoryBtnClick = () => {
        router.push('/admin/paymentHistory');
    };

    const handleAdminMenuBtnClick = () => {
        const url = `/admin/${(user as any)?.id }/menu`;
        router.push(url);
        //?id=${id}
    };

    return (
        <div className='flex justify-center bg-gray-200' style={{ minHeight: '100vh' }}>
            <div>
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
                <div className='bg-white p-14 px-32  rounded-lg shadow-xl mb-20' style={{ width:'1280px'}}>
                    <h1 className='flex justify-center font-bold text-xl pb-12'>내역 관리</h1>
                    <div className='flex justify-between mb-8'>
                        <div className='flex justify-center rounded-lg border outline-gray-700' style={{borderWidth:'2px'}}>
                            <input 
                                className='mx-3'
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <span className='flex items-center px-4'>~</span>
                            <input 
                                className='mx-3'
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                
                            />
                        </div>
                        <div className='flex justify-center rounded-lg border outline-gray-700' style={{borderWidth:'2px'}}>
                        <input 
                            type="text" 
                            placeholder="메뉴 검색" 
                            style={{ padding: '10px', flex: '1' }} 
                        />
                        <button 
                            className='px-4'
                            onClick={handleSearch}
                        >
                            검색
                        </button>
                        </div>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <table className='rounded-lg mb-12 w-full border-collapse' style={{borderWidth:'2px'}}>
                        <thead>
                            <tr>
                                <th className='border outline-gray-700' style={{  padding: '8px' }}>날짜</th>
                                <th className='border outline-gray-700' style={{  padding: '8px' }}>시간</th>
                                <th className='border outline-gray-700' style={{  padding: '8px', width:'420px' }}>결제 내역</th>
                                <th className='border outline-gray-700' style={{  padding: '8px' }}>금액</th>
                                <th className='border outline-gray-700' style={{  padding: '8px' }}>상세보기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={index}>
                                    <td className='text-center border outline-gray-700 p-2'>{payment.date}</td>
                                    <td className='text-center border outline-gray-700 p-2'>{payment.time}</td>
                                    <td className='border outline-gray-700 p-2'>{payment.details}</td>
                                    <td className='text-center border outline-gray-700 p-2'>{payment.amount}</td>
                                    <td className='text-center border outline-gray-700 p-2'><button>상세보기</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
