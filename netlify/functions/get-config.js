// 프론트엔드에 필요한 공개 환경변수 전달 (anon key, paypal client id)
export const handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      paypalClientId: process.env.PAYPAL_CLIENT_ID,
    }),
  };
};
