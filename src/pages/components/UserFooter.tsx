
export default function UserFooter() {
 
  return (
    <div className='flex justify-center bg-white w-full fixed bottom-0 h-14'>
      <div className='itmes-center max-w-sm w-full mx-4'>
         <div className="flex justify-between text-xs my-1 font-bold">
          <button className="flex flex-col items-center ">
            <img className="bg-gray-400 w-8 h-8 mx-3" src=""/>
              홈
          </button>
          <button className="flex flex-col items-center">
            <img className="bg-gray-400 w-8 h-8 mx-3" src=""/>
            장바구니
          </button>
          <button className="flex flex-col items-center">
            <img className="bg-gray-400 w-8 h-8 mx-3" src=""/>
            로그아웃
          </button>
         </div>
            
      </div>
    </div>
  )

}