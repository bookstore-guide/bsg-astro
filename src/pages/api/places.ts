import type { APIRoute } from 'astro';
import { getCachedPlaces } from '../../lib/place-cache';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const places = await getCachedPlaces();
    return new Response(JSON.stringify(places), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/places] error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
