// Stripe Checkout 세션 생성 — 결제 전 호출
import Stripe from 'stripe';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { bookId, title, price, userId, readUrl } = JSON.parse(event.body);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = event.headers.origin || 'https://bookcoupling.netlify.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: title },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }],
      metadata: { bookId, userId },
      success_url: `${origin}/payment-success.html?method=stripe&session_id={CHECKOUT_SESSION_ID}&readUrl=${encodeURIComponent(readUrl)}`,
      cancel_url: `${origin}/library.html`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
