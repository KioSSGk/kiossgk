import StoreDetail_idx from "./components/user_store_detail/Storedetail_idx"
import UserHeader from "./components/UserHeader";
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