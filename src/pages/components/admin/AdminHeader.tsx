import { useRouter } from "next/router";
import useAuth from '@/lib/useAuth';

const AdminHeader = () => {

    const { user } = useAuth();
    const router = useRouter();

    const handleAdminIconClick = () => {
    const url = `/admin/${(user as any)?.id }/main`;
    router.push(url);
    };

    return(
        <div className="flex justify-center items-center bg-white w-full h-[60px]">
                <div className="flex items-center justify-between w-[1280px]">
                        <div className="flex items-center">
                            <button className="bg-black w-[40px] h-[40px] mr-5" onClick={handleAdminIconClick}>
                                {/* 아이콘이미지 */}
                            </button>
                            <div>
                                Universal Kiossgk
                            </div>
                        </div>
                        <div className="flex items-center ">
                            <div className="mr-5">
                                어드민 이름
                            </div>
                            <div>
                                로그아웃
                            </div>
                        </div>
                </div>

        </div>
    )

}

export default AdminHeader;