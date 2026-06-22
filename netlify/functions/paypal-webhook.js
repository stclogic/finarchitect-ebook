// PayPal Webhook 수신 — 결제 완료 이벤트 처리
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

    // PAYMENT.CAPTURE.COMPLETED 이벤트만 처리
    if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      console.log('결제 완료 Webhook 수신:', body.resource?.id);
    }

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
