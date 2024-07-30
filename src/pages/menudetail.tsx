import MenuDetail_idx from "./components/user_menu_detail/menudetail_idx"
import UserHeader from "./components/UserHeader";
const MenuDetail = () => {
return(
    <div className="h-auto bg-orange-400">
        <div className='flex justify-center'>
            <UserHeader></UserHeader>
        </div>
        <div>
            <MenuDetail_idx></MenuDetail_idx>
        </div>
    </div>
)
}
export default MenuDetail;