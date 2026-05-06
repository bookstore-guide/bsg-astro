import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';
import { preSortPlaces } from '../../../shared/utils';
import { requireAuth, jsonError } from '../../../lib/api-utils';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const authError = await requireAuth(request.headers);
  if (authError) return authError;

  try {
    const places = await prisma.place.findMany();
    const sortedPlaces = preSortPlaces(places);
    return new Response(JSON.stringify(sortedPlaces), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/places] error:', err);
    return jsonError('Internal server error', 500);
  }
};
