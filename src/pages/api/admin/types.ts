import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';


export const prerender = false;

export const GET: APIRoute = async () => {
  const placeTypes = await prisma.placeType.findMany();

  return new Response(JSON.stringify(placeTypes), {
    headers: { 'Content-Type': 'application/json' }
  });
};
