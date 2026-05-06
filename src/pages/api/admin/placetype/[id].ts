import type { APIRoute } from 'astro';
import prisma from '../../../../lib/prisma';
import { requireAuth, jsonError } from '../../../../lib/api-utils';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const placeType = await prisma.placeType.findUnique({
      where: { id: Number(params.id) }
    });
    return new Response(JSON.stringify(placeType), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/placetype] GET error:', err);
    return jsonError('Internal server error', 500);
  }
};

export const PUT: APIRoute = async ({ request, params }) => {
  const authError = await requireAuth(request.headers);
  if (authError) return authError;

  try {
    const body = await request.json();
    const id = Number(params.id);
    const data = {
      name: body.name,
      description: body.description,
      internalNotes: body.internalNotes,
      active: body.active
    };
    const placeType = await prisma.placeType.upsert({
      create: data,
      update: data,
      where: { id }
    });
    return new Response(JSON.stringify(placeType), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/placetype] PUT error:', err);
    return jsonError('Internal server error', 500);
  }
};

export const DELETE: APIRoute = async ({ request, params }) => {
  const authError = await requireAuth(request.headers);
  if (authError) return authError;

  try {
    const id = Number(params.id);
    await prisma.placeType.update({
      where: { id },
      data: { places: { set: [] } }
    });
    const deleted = await prisma.placeType.delete({ where: { id } });
    return new Response(JSON.stringify(deleted), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/placetype] DELETE error:', err);
    return jsonError('Internal server error', 500);
  }
};
