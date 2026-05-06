import { auth } from './auth';

export async function requireAuth(headers: Headers): Promise<Response | null> {
  const session = await auth.api.getSession({ headers });
  if (!session?.user) {
    return jsonError('Unauthorized', 401);
  }
  return null;
}

export function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
