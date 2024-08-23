import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { useRouter } from 'next/router';
import useAuth from '@/lib/useAuth';
import axios from 'axios';
import ViewOrderDetailsComponent from './ViewOrderDetailsComponent';

const AdminMainPage: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            router.push('/admin/login');
        }
    }, [user, router]);

    const [date, setDate] = useState<Date | [Date, Date]>(new Date());
    const [dailySales, setDailySales] = useState<Record<string, number>>({});
    const [monthlySalesTotal, setMonthlySalesTotal] = useState<number>(0);

    const handleDateChange: CalendarProps['onChange'] = (newDate) => {
        setDate(newDate as Date | [Date, Date]);
        updateMonthlySalesTotal(newDate as Date);
    };

    const fetchSalesData = async () => {
        try {
            const response = await axios.get('/api/admin_calender_api/calenderSales');
            setDailySales(response.data.dailySales);

            // 데이터 로드 후 현재 월의 총매출 계산
            updateMonthlySalesTotal(new Date());
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    };

    const updateMonthlySalesTotal = (date: Date) => {
        const yearMonth = date.toISOString().slice(0, 7); // "YYYY-MM" 형식으로 변환
        const monthlyTotal = Object.keys(dailySales)
            .filter((key) => key.startsWith(yearMonth))
            .reduce((sum, key) => sum + dailySales[key], 0);
        setMonthlySalesTotal(monthlyTotal);
    };

    const getTileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0];
            const sales = dailySales[dateString];
            return sales ? <p>{`₩${sales.toLocaleString()}`}</p> : null;
        }
        return null;
    };

    useEffect(() => {
        fetchSalesData();
    }, []);

    if (user === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex justify-center pb-10'>
            <div>
                <div className='flex '>
                    <div className='pr-10'>
                        <div className='bg-white rounded-lg shadow-lg'>
                            <Calendar
                                onChange={handleDateChange}
                                value={date}
                                locale="ko-KR"
                                calendarType="iso8601"
                                tileContent={getTileContent}
                                className="custom-calendar h-96"
                            />
                            <h3 className='py-3 flex justify-end mr-4'>
                                월별 총매출: ₩{monthlySalesTotal.toLocaleString()}
                            </h3>
                        </div>
                    </div>
                    <div className='flex bg-white justify-center rounded-lg shadow-lg'>
                        <div>
                            <h1 className='flex justify-center font-bold pt-2 pb-4'>주문확인</h1>
                            <div className='overflow-y-auto h-[548px]' style={{width:'488px', height:'500px'}}>
                                    <ViewOrderDetailsComponent/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMainPage;
