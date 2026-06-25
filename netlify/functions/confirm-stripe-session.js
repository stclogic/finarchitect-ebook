// Stripe 결제 확인 + Supabase 구매 기록 저장
import Stripe from 'stripe';
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
    const { sessionId } = JSON.parse(event.body);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return { statusCode: 400, body: JSON.stringify({ error: '결제 미완료' }) };
    }

    const { bookId, userId } = session.metadata;
    const amountPaid = session.amount_total;

    await supabase.from('book_purchases').upsert({
      user_id: userId,
      book_id: bookId,
      amount_paid: amountPaid,
      stripe_session_id: sessionId,
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
