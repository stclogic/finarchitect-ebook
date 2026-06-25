// 프론트엔드에 필요한 공개 환경변수 전달 (anon key, paypal client id)
export const handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      supabaseUrl: (process.env.SUPABASE_URL || '').replace(/\/$/, ''),
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      paypalClientId: process.env.PAYPAL_CLIENT_ID,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      tossClientKey: process.env.TOSS_CLIENT_KEY,
    }),
  };
};
