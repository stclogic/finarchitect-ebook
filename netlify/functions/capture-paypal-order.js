// PayPal 결제 캡처 + Supabase 구매 기록 저장
import { createClient } from '@supabase/supabase-js';

const PAYPAL_API = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getAccessToken() {
  const creds = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { orderID, type, bookId, serviceType, userId, formData } = JSON.parse(event.body);

    // PayPal 결제 캡처
    const token = await getAccessToken();
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const capture = await res.json();

    if (capture.status !== 'COMPLETED') {
      return { statusCode: 400, body: JSON.stringify({ error: '결제 실패' }) };
    }

    const amountPaid = Math.round(
      parseFloat(capture.purchase_units[0].payments.captures[0].amount.value) * 100
    );

    // eBook 구매 기록
    if (type === 'book') {
      await supabase.from('book_purchases').insert({
        user_id: userId,
        book_id: bookId,
        amount_paid: amountPaid,
        paypal_order_id: orderID,
      });
    }

    // 컨설팅 신청 기록
    if (type === 'consulting') {
      await supabase.from('consulting_orders').insert({
        user_id: userId,
        service_type: serviceType,
        amount_paid: amountPaid,
        paypal_order_id: orderID,
        status: 'paid',
        applicant_name: formData.name,
        applicant_company: formData.company,
        applicant_email: formData.email,
        applicant_phone: formData.phone,
        message: formData.message,
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
