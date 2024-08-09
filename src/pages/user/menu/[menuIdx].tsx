import { useRouter } from "next/router";
import MenuDetail_idx from "../../components/user/menuDetailIdx";
import UserHeader from "../../components/UserHeader";
import { useEffect, useState } from "react";

const MenuDetail = () => {
    const router = useRouter();
    const [numericMenuId, setNumericMenuId] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        //console.log("useEffect 실행됨");
        if (!router.isReady) {
            //console.log("Router가 준비되지 않음, 대기 중...");
            return;
        }

        const { menuIdx } = router.query;
       // console.log("Router가 준비됨, menuIdx:", menuIdx);

        if (menuIdx && !isLoaded) {
            const parsedMenuId = parseInt(menuIdx as string, 10);
            //console.log("Parsed menuIdx:", parsedMenuId);

            if (!isNaN(parsedMenuId)) {
                setNumericMenuId(parsedMenuId);
                setIsLoaded(true);  // 한 번 로드된 후에는 다시 로딩되지 않도록 설정
            } else {
                console.error('유효하지 않은 menuIdx:', menuIdx);
            }
        } else if (!menuIdx) {
            console.log("menuIdx 아직 사용 불가");
        }
    }, [router.isReady, router.query, isLoaded]);

    // numericMenuId가 null이면 로딩 상태 표시
    if (numericMenuId === null) {
        return <div>로딩 중입니다...</div>;
    }

    return (
        <div className="h-auto bg-orange-400">
            <div className='flex justify-center'>
                <UserHeader />
            </div>
            <div>
                <MenuDetail_idx menuId={numericMenuId} />
            </div>
        </div>
    );
}

export default MenuDetail;
