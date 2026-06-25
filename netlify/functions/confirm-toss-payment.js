// 토스페이먼츠 결제 확인 + Supabase 구매 기록 저장
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { paymentKey, orderId, amount } = JSON.parse(event.body);

    // 토스 결제 승인 API 호출
    const authHeader = 'Basic ' + Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64');
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const payment = await tossRes.json();
    if (!tossRes.ok) {
      return { statusCode: 400, body: JSON.stringify({ error: payment.message || '결제 실패' }) };
    }

    // orderId 형식: book_{bookId}_{userId}_{timestamp}
    const parts = orderId.split('_');
    const bookId = parts[1];
    const userId = parts[2];

    await supabase.from('book_purchases').upsert({
      user_id: userId,
      book_id: bookId,
      amount_paid: amount,
      toss_payment_key: paymentKey,
    }, { onConflict: 'user_id,book_id' });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
