import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import UserHeader from "@/pages/components/UserHeader";
import UserFooter from "@/pages/components/UserFooter";

export function PaymentSuccessPage() {
  const router = useRouter();
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    async function confirm() {
      // 쿼리 파라미터를 가져옴
          // 쿼리 파라미터를 가져옴
    const orderId = typeof router.query.orderId === 'string' ? router.query.orderId : '';
    const amount = typeof router.query.amount === 'string' ? router.query.amount : '';
    const paymentKey = typeof router.query.paymentKey === 'string' ? router.query.paymentKey : '';


      const requestData = {
        orderId,
        amount,
        paymentKey,
      };

      // 서버에 POST 요청을 보냄
      const response = await fetch("/api/confirm/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        // 에러가 발생하면 실패 페이지로 리다이렉트 개발을 위해 잠시 막아둡니다
        throw { message: json.message, code: json.code };
      }

      // 결제 성공 시 주문 데이터를 백엔드에 저장하는 요청 추가
      await saveOrderDataToBackend(orderId, amount, paymentKey); // 추가된 부분

      return json;
    }

    // 주문 데이터를 백엔드에 저장하는 함수
    async function saveOrderDataToBackend(orderId: string, amount: string, paymentKey: string) {
      try {
        // 결제 완료 후 서버에서 필요한 정보를 백엔드에 전송
        const orderData = {
          order_idx: orderId,
          paymentKey: paymentKey,
          amount: parseInt(amount, 10),
        };

        // API를 통해 백엔드에 주문 데이터 저장
        await fetch('/api/order/saveOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
          
        });
      } catch (error) {
        console.error('Error saving order data:', error);
        // 추가적인 오류 처리 로직을 여기에 추가할 수 있습니다.
      }
     

    }

    if (router.isReady) {
      confirm()
        .then((data) => {
          setResponseData(data);
        })
        .catch((error) => {
          // 에러 시 /fail 경로로 리다이렉트
          router.push(`/fail?code=${error.code}&message=${error.message}`);
        });
    }
  

  // 2초 후에 orderCompletePage로 라우팅
    const timer = setTimeout(() => {
      router.push('/user/orderComplete');
    }, 2000);

    // 컴포넌트 언마운트 시 타이머를 클리어하여 메모리 누수를 방지
    return () => clearTimeout(timer);
  }, [router.isReady, router.query]);

  return (
    <>
      <UserHeader/>
      <div className="flex justify-center pt-28 min-h-dvh h-full bg-slate-100">
        <div className="min-w-sm w-full max-w-sm ">
          <div className="box_section bg-white shadow-lg border-slate-100 border-2 rounded-lg mx-2 px-12 pt-12 pb-8" >
            <div className="flex justify-center ">
              <div>
                <div className="flex justify-center">
                  <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" />
                </div>
                <div className="flex justify-center">
                  <h2>결제를 완료했어요</h2>
                </div>
              </div>
            </div>
            <div className="flex justify-between p-grid typography--p pt-12" style={{ marginTop: "50px" }}>
              <div className="p-grid-col text--left">
                <b>결제금액</b>
              </div>
              <div className="p-grid-col text--right" id="amount">
              {router.query.amount
            ? `${Number(router.query.amount).toLocaleString()}원`
            : '금액을 가져오는 중입니다...'}
              </div>
            </div>
            <div className="flex justify-between p-grid typography--p" style={{ marginTop: "10px" }}>
              <div className="p-grid-col text--left">
                <b>주문번호</b>
              </div>
              <div className="p-grid-col text--right" id="orderId">
              {router.query.orderId ? `${router.query.orderId}` : '주문 ID를 가져오는 중입니다...'}
              </div>
            </div>
            {/* <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
              <div className="p-grid-col text--left">
                <b>paymentKey</b>
              </div>
              <div className="p-grid-col text--right" id="paymentKey" style={{ whiteSpace: "initial", width: "250px" }}>
              {router.query.paymentKey ? `${router.query.paymentKey}` : '결제 키를 가져오는 중입니다...'}
              </div>
            </div> */}
            {/* <div className="p-grid-col">
              <Link href="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
                <button className="button p-grid-col5">연동 문서</button>
              </Link>
              <Link href="https://discord.gg/A4fRFXQhRu">
                <button className="button p-grid-col5" style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}>
                  실시간 문의
                </button>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
      <UserFooter/>
    </>
  );
}

export default PaymentSuccessPage;
