import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';
import { jsonError } from '../../../lib/api-utils';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const placeTypes = await prisma.placeType.findMany();
    return new Response(JSON.stringify(placeTypes), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/placetypes] error:', err);
    return jsonError('Internal server error', 500);
  }
};
