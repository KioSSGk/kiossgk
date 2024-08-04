import StoreDetail_idx from "../components/user/StoreDetailIdx"
import UserHeader from "../components/UserHeader";
const StoreDetail = () => {
    return(
        <div className="h-auto bg-orange-400">
            <div className='flex justify-center'>
                <UserHeader></UserHeader>
            </div>
        <StoreDetail_idx/> 
        </div>
    )
    }
    export default StoreDetail;