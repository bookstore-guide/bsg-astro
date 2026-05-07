import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';
import { jsonError } from '../../../lib/api-utils';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const neighborhoods = await prisma.neighborhood.findMany({ orderBy: { name: 'asc' } });
    return new Response(JSON.stringify(neighborhoods), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/neighborhoods] error:', err);
    return jsonError('Internal server error', 500);
  }
};
