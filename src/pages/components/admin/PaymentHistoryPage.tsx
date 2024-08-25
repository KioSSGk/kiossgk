import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const PaymentHistoryPage: React.FC = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('2024-01-01'); // 기본값 설정
    const [endDate, setEndDate] = useState<string>('2024-12-31'); // 기본값 설정
    const router = useRouter();
    const { adminId } = router.query; // 쿼리에서 adminId 가져오기

    const fetchPayments = async (start: string, end: string, adminId: string | string[] | undefined) => {
        try {
            console.log("넘겨받은 데이터", start, end, adminId); // 파라미터 값 확인

            const response = await axios.get('/api/admin_payment_history_api/payment-history', {
                params: { startDate: start, endDate: end, adminId: adminId }
            });
            setPayments(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching payment history:', error);
            setError('결제 내역을 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        if (router.isReady && adminId) {
            fetchPayments(startDate, endDate, adminId);
        } else if (router.isReady && !adminId) {
            setError('어드민 아이디가 없습니다.');
        }
    }, [router.isReady, adminId, startDate, endDate]); // startDate와 endDate가 변경될 때마다 실행

    return (
        <div className='flex justify-center' style={{ minHeight: '100vh' }}>
            <div>
                <div className='bg-white p-14 px-32 rounded-lg shadow-xl mb-20' style={{ width: '1280px' }}>
                    <h1 className='flex justify-center font-bold text-xl pb-12'>내역 관리</h1>
                    <div className='flex justify-between mb-8'>
                        <div className='flex justify-center rounded-lg border outline-gray-700' style={{ borderWidth: '2px' }}>
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
                        <div className='flex justify-center rounded-lg border outline-gray-700' style={{ borderWidth: '2px' }}>
                            <input
                                type="text"
                                placeholder="메뉴 검색"
                                style={{ padding: '10px', flex: '1' }}
                            />
                            <button
                                className='px-4'
                                onClick={() => fetchPayments(startDate, endDate, adminId)}
                            >
                                검색
                            </button>
                        </div>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <table className='rounded-lg mb-12 w-full border-collapse' style={{ borderWidth: '2px' }}>
                        <thead>
                            <tr>
                                <th className='border outline-gray-700' style={{ padding: '8px' }}>날짜</th>
                                <th className='border outline-gray-700' style={{ padding: '8px' }}>시간</th>
                                <th className='border outline-gray-700' style={{ padding: '8px', width: '420px' }}>결제 내역</th>
                                <th className='border outline-gray-700' style={{ padding: '8px' }}>금액</th>
                                {/* <th className='border outline-gray-700' style={{ padding: '8px' }}>상세보기</th> */}
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

export default PaymentHistoryPage;
