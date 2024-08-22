import { useRouter } from 'next/router';

export default function UserFooter() {
  const router = useRouter();
  return (
    <div className='flex justify-center bg-white w-full fixed bottom-0 h-14 shadow-[0_-1px_6px_rgba(0,0,0,0.1)]' >
      <div className='itmes-center max-w-sm w-full mx-4'>
         <div className="flex justify-between text-xs my-1 font-bold">
         <button className="flex flex-col items-center" onClick={()=>{ router.back();}}>
            <img className="bg-gray-400 w-8 h-8 mx-3" src=""/>
            뒤로가기
          </button>
          <button className="flex flex-col items-center ">

            <img className="w-8 h-8 mx-3"
             src="https://kiosk-project-assets.s3.ap-northeast-2.amazonaws.com/home.png"
             alt="Home"
              onClick={()=>{router.push('/user');}}
             />
              홈

          </button>
          <button className="flex flex-col items-center">
            <img className="bg-gray-400 w-8 h-8 mx-3" src=""
            onClick={()=>{router.push('/user/cart');}}/>
            장바구니
          </button>

         </div>
            
      </div>
    </div>
  )

}