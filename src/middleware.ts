import { auth } from './lib/auth';
import { defineMiddleware } from 'astro:middleware';

const protectedPageUrls = ['/manage'];

// Sliding-window rate limiter for the public places API
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  if (url.pathname === '/api/places') {
    const ip = getClientIp(context.request);
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (protectedPageUrls.some((path) => url.pathname.startsWith(path))) {
    const isAuthed = await auth.api.getSession({
      headers: context.request.headers
    });
    if (!isAuthed) {
      return context.redirect('/auth/signin');
    }
  }

  const response = await next();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});
