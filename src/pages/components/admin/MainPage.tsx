import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { useRouter } from 'next/router';
import useAuth from '@/lib/useAuth';

const AdminMainPage: React.FC = () => {
    const { user } = useAuth();
    console.log('use auth에서 불러온 user:', user);
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            router.push('/login');
        }
    }, [user, router]);

    const [date, setDate] = useState<Date | [Date, Date]>(new Date());

    const handleDateChange: CalendarProps['onChange'] = (newDate) => {
        setDate(newDate as Date | [Date, Date]);
    };

    const handleAdminPaymenthistoryBtnClick = () => {
        router.push('/admin/paymentHistory');
    };

    const handleAdminMenuBtnClick = () => {
        router.push('/admin/menu');
    };

    const salesData: Record<string, number> = {
        '2024-07-13': 16000,
        '2024-07-14': 9000,
    };

    const getTileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0];
            const sales = salesData[dateString];
            return sales ? <p>{`₩${sales.toLocaleString()}`}</p> : null;
        }
        return null;
    };

    if (user === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>어드민 메인 페이지</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                    <button
                        style={{ width: '100%', padding: '20px', marginBottom: '10px', backgroundColor: '#00b894', color: 'white', border: 'none', borderRadius: '5px' }}
                        onClick={() => alert('현장결제 클릭됨')}
                    >
                        현장결제
                    </button>
                    <button
                        style={{ width: '100%', padding: '20px', marginBottom: '10px', backgroundColor: '#0984e3', color: 'white', border: 'none', borderRadius: '5px' }}
                        onClick={handleAdminMenuBtnClick}
                    >
                        상품관리
                    </button>
                    <button
                        style={{ width: '100%', padding: '20px', marginBottom: '10px', backgroundColor: '#d63031', color: 'white', border: 'none', borderRadius: '5px' }}
                        onClick={handleAdminPaymenthistoryBtnClick}
                    >
                        내역관리
                    </button>
                </div>
                <div style={{ flex: 3, marginRight: '10px', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>월별 매출</h2>
                    <Calendar
                        onChange={handleDateChange}
                        value={date}
                        locale="ko-KR"
                        calendarType="iso8601"
                        tileContent={getTileContent}
                        className="custom-calendar"
                    />
                    <h3 style={{ textAlign: 'right' }}>월별 총매출: ₩320,300,000</h3>
                </div>
                <div style={{ flex: 2, backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>주문내역</h2>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>2024.07.13</span>
                            <span>짜장면 x 2</span>
                            <span>₩16,000</span>
                            <button
                                style={{ backgroundColor: '#0984e3', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                                onClick={() => alert('상세보기 클릭됨')}
                            >
                                상세보기
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>2024.07.13</span>
                            <span>짬뽕 x 1</span>
                            <span>₩9,000</span>
                            <button
                                style={{ backgroundColor: '#0984e3', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                                onClick={() => alert('상세보기 클릭됨')}
                            >
                                상세보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMainPage;
