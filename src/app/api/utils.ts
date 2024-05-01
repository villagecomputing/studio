export const X_API_KEY_HEADER = 'x-api-key';
export const LOGGED_IN_USER_ID = 'logged_in_user_id';

export function response(message: string, status: 200 | 400 | 401 | 500 = 200) {
  return new Response(JSON.stringify({ message }), {
    headers: { 'Content-Type': 'application/json' },
    status,
  });
}
