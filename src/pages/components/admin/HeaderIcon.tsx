import { useRouter } from "next/router";
import useAuth from '@/lib/useAuth';

const HeaderIcon = () => {

    const { user } = useAuth();
    const router = useRouter();

        const handleAdminPaymenthistoryBtnClick = () => {
        router.push('/admin/paymentHistory');
    };

    const handleAdminMenuBtnClick = () => {
        const url = `/admin/${(user as any)?.id }/menu`;
        router.push(url);
        //?id=${id}
    };

            return(
                <div className='flex justify-center py-10'>
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
    )
}


export default HeaderIcon;