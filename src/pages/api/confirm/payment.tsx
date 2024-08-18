import { NextApiRequest, NextApiResponse } from 'next';


const apiSecretKey = "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R";
const encryptedApiSecretKey = "Basic " + Buffer.from(apiSecretKey + ":").toString("base64");

export default async (req: NextApiRequest, res: NextApiResponse) => {
if (req.method==='POST'){}

    const { paymentKey, orderId, amount } = req.body;
  
    // 결제 승인 API를 호출하세요.
    // 결제를 승인하면 결제수단에서 금액이 차감돼요.
    // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
    fetch("https://api.tosspayments.com/v1/payments/confirm", {//여기서 토스에 접속해서 정보를 받아오는 그런 과정입니다.
      method: "POST",
      headers: {
        Authorization: encryptedApiSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        amount: amount,
        paymentKey: paymentKey,
      }),
    }).then(async function (response) {
      const result = await response.json();
      console.log(result);
  
      if (!response.ok) {
        // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
        res.status(response.status).json(result);
  
        return;
      }
  
      // TODO: 결제 완료 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);
    });
  

};