import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';
import { jsonError } from '../../../lib/api-utils';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const traits = await prisma.trait.findMany();
    return new Response(JSON.stringify(traits), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/traits] error:', err);
    return jsonError('Internal server error', 500);
  }
};
