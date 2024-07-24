import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentHistoryPage: React.FC = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const fetchPayments = async (start: string, end: string) => {
        try {
            const response = await axios.get('/api/payment-history', {
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

    const handleSearch = () => {
        if (startDate && endDate) {
            fetchPayments(startDate, endDate);
        } else {
            setError('날짜 범위를 선택하세요.');
        }
    };

    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>내역 관리</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ padding: '10px', marginRight: '10px' }} 
                />
                <span>~</span>
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ padding: '10px', marginLeft: '10px' }} 
                />
                <input 
                    type="text" 
                    placeholder="메뉴 검색" 
                    style={{ padding: '10px', marginLeft: '20px', flex: '1' }} 
                />
                <button 
                    onClick={handleSearch}
                    style={{ padding: '10px', marginLeft: '10px' }}
                >
                    검색
                </button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>날짜</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>시간</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>결제 내역</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>금액</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>상세보기</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payment.date}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payment.time}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payment.details}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payment.amount}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><button>상세보기</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => alert('뒤로가기')} style={{ padding: '10px' }}>뒤로가기</button>
        </div>
    );
};

export default PaymentHistoryPage;
