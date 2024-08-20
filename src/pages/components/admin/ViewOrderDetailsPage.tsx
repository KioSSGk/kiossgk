import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import useAuth from '@/lib/useAuth';

const ViewOrderDetailsPage: React.FC = () => {
    const [orderData, setOrderData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();
    const { storeId } = router.query;

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/admin_view_order_details_api/order', {
                params: { storeId: storeId }
            });
            console.log('API 응답:', response.data);
            setOrderData(response.data);
            setError(null);
            console.log(orderData)
        } catch (error) {
            console.error('Error fetching view orders:', error);
            setError('주문 목록을 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        if (storeId) {
            fetchOrders();
        }
    }, [storeId]);

    const handleAdminPaymenthistoryBtnClick = () => {
        router.push('/admin/paymentHistory');
    };

    const handleAdminMenuBtnClick = () => {
        const url = `/admin/${(user as any)?.id }/menu`;
        router.push(url);
        //?id=${id}
    };
    
    const handleCookingComplete = async (orderId: number) => {
        try {
            await axios.put('/api/admin_view_order_details_api/order', {
                orderId: orderId,
                orderState: '05'
            });
            fetchOrders();
        } catch (error) {
            console.error('조리완료 업데이트 에러가 발생했습니다', error);
        }
    }

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
                <div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div>
                            {orderData.map((order, index) => (
                                <div key={index} className=''>
                                    <div className='flex items-center justify-between rounded-md shadow-md bg-white p-4 mb-4'>
                                        <div className=''>
                                            주문번호 : 
                                            {order.order_idx}
                                        </div>
                                        <div>
                                            주문시간 :
                                            {order.created}
                                        </div>
                                        <div className='font-bold'>
                                            {order.menu_name}
                                        </div>
                                        <div>
                                            <button 
                                                className='bg-indigo-500 text-white font-bold rounded-md mx-2 p-2'
                                                
                                                onClick={()=>handleCookingComplete(order.order_idx)}
                                                >
                                                조리완료
                                            </button>
                                            <button 
                                                className='bg-indigo-500 text-white font-bold rounded-md mx-2 p-2'>
                                                주문취소
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewOrderDetailsPage;
