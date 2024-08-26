import { useRouter } from "next/router";
import useAuth from '@/lib/useAuth';

const HeaderIcon = () => {

    const { user } = useAuth();
    const router = useRouter();

        const handleAdminPaymenthistoryBtnClick = () => {
        router.push(`/admin/${(user as any)?.id }/paymentHistory`);
    };

    const handleAdminMenuBtnClick = () => {
        const url = `/admin/${(user as any)?.id }/menu`;
        router.push(url);
        //?id=${id}
    };

    const handleViewOrderBtnClick = () => {
    const url = `/admin/${(user as any)?.id }/ViewOrderDetails`;
    router.push(url);
    };

            return(
                <div className='flex justify-center py-10'>
                    <div className='flex pr-10'>
                        <button className='flex items-center bg-white p-6 rounded-lg shadow-md'
                            // onClick={() => handleButtonClick('현장결제 클릭됨')} 버튼 기능 제작 필요
                            style={{width:'224px'}} onClick={()=>{router.back()}}>
                            <img src="https://universalkiossgk.s3.amazonaws.com/Back.png" alt="메뉴리스트 아이콘" style={{width:'60px', height:'60px'}}/>
                                <div className='pl-6'>
                                    뒤로가기
                                </div>
                        </button>
                    </div>
                    <div className='flex pr-10'>
                        <button className='flex items-center bg-white p-6 rounded-lg shadow-md'
                            //onClick={() => handleAdminMenuBtnClick()}
                            //마이페이지가 구현되면 라우팅 연결이 필요합니다. 
                            style={{width:'224px'}}>
                            <img src="https://universalkiossgk.s3.amazonaws.com/MyPage.png" alt="메뉴리스트 아이콘" style={{width:'60px', height:'60px'}}/>
                            <div className='pl-6'>
                                마이페이지
                            </div>
                        </button>
                    </div>
                    <div className='flex pr-10'>
                        <button className='flex items-center bg-white p-6 rounded-lg shadow-md'
                            onClick={() => handleViewOrderBtnClick()}
                            style={{width:'224px'}}>
                            <img src="https://universalkiossgk.s3.amazonaws.com/ViewOrder.png" alt="메뉴리스트 아이콘" style={{width:'60px', height:'60px'}}/>
                            <div className='pl-6'>
                                주문확인
                            </div>
                        </button>
                    </div>
                    <div className='flex  pr-10'>
                        <button className='flex items-center bg-white p-6 rounded-lg shadow-md'
                            onClick={() => handleAdminMenuBtnClick()}
                            style={{width:'224px'}}>
                            <img src="https://universalkiossgk.s3.amazonaws.com/MenuList.png" alt="메뉴리스트 아이콘" style={{width:'60px', height:'60px'}}/>
                            <div className='pl-6'>
                                메뉴관리
                            </div>
                        </button>
                    </div>
                    <div className='flex '>
                        <button className='flex items-center bg-white p-6 rounded-lg shadow-md'
                        onClick={() => handleAdminPaymenthistoryBtnClick()} 
                        style={{width:'224px'}}>
                            <img src="https://universalkiossgk.s3.amazonaws.com/OrderList.png" alt="메뉴리스트 아이콘" style={{width:'60px', height:'60px'}}/>
                            <div className='pl-6'>
                                내역관리
                            </div>
                        </button>
                    </div>
                </div>
    )
}


export default HeaderIcon;