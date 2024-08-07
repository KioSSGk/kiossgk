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
        const url = `/admin/${(user as any)?.id }/menu`;
        router.push(url);
        //?id=${id}
    };

    const salesData: Record<string, number> = {
        '2024-07-13': 16000,
        '2024-07-14': 9000,
        '2024-08-04': 38570000,
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

        <div className='flex  justify-center'>
            <div >
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
                                onClick={() => handleAdminMenuBtnClick()}
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
                                onClick={() => handleAdminPaymenthistoryBtnClick()}
                            >
                                상품결재
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center pr-10'>
                        <div className='flex bg-white p-6 rounded-lg shadow-md' style={{width:'224px'}}>
                            <div className='bg-black' style={{width:'60px', height:'60px'}}/>
                            <button 
                                className='pl-6'
                                onClick={() => handleAdminPaymenthistoryBtnClick()}
                            >
                                메뉴관리
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center pr-10'>
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
                            <h3 className='py-3 flex justify-end mr-4'>월별 총매출: ₩320,300,000</h3>
                        </div>
                    </div>
                    <div className='flex bg-white justify-center rounded-lg shadow-lg overflow-y-auto' style={{width:'488px', height:'548px'}}>
                        <div>
                        <h2 className='flex justify-center py-6 bg-white sticky top-0'>주문내역</h2>
                            <div>
                                <div className='py-3'>
                                    <div className='p-6 border-solid border-2 rounded-lg' style={{width:'428px'}}>
                                        <div>2024.07.13 13:20:56</div>
                                        <div className='flex justify-between pt-3 font-bold'>
                                            <div>
                                                짜장면
                                            </div>
                                            <div>
                                                x 2
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div>
                                                고기추가
                                            </div>
                                            <div>
                                                x 1
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div>
                                                짬뽕국물 추가
                                            </div>
                                            <div>
                                                x 1
                                            </div>
                                        </div>
                                        <div className='flex justify-between pt-6'>
                                            <button className='bg-indigo-500 text-white font-bold rounded-md' style={{width:'180px', height:'36px'}}>
                                                주문취소
                                            </button>
                                            <button className='bg-indigo-500 text-white font-bold rounded-md' style={{width:'180px', height:'36px'}}>
                                                조리완료
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='py-3'>
                                    <div className='p-6 border-solid border-2 rounded-lg' style={{width:'428px'}}>
                                        <div>2024.07.13 13:20:56</div>
                                        <div className='flex justify-between pt-3 font-bold'>
                                            <div>
                                                짬뽕
                                            </div>
                                            <div>
                                                x 2
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div>
                                                고기추가
                                            </div>
                                            <div>
                                                x 1
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div>
                                                오징어 빼기
                                            </div>
                                            <div>
                                                x 1
                                            </div>
                                        </div>
                                        <div className='flex justify-between pt-3 font-bold'>
                                            <div>
                                                짬뽕
                                            </div>
                                            <div>
                                                x 2
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div>
                                                고기추가
                                            </div>
                                            <div>
                                                x 1
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div>
                                                오징어 빼기
                                            </div>
                                            <div>
                                                x 1
                                            </div>
                                        </div>
                                        <div className='flex justify-between pt-6'>
                                            <button className='bg-indigo-500 text-white font-bold rounded-md' style={{width:'180px', height:'36px'}}>
                                                주문취소
                                            </button>
                                            <button className='bg-indigo-500 text-white font-bold rounded-md' style={{width:'180px', height:'36px'}}>
                                                조리완료
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            
                            {/* 추가 주문 내역을 여기에 추가 */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMainPage;
