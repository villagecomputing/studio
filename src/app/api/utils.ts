export function response(message: string, status: 200 | 400 | 500 = 200) {
  return new Response(JSON.stringify({ message }), {
    headers: { 'Content-Type': 'application/json' },
    status,
  });
}
