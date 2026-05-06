import type { APIRoute } from 'astro';
import prisma from '../../../../lib/prisma';
import { requireAuth, jsonError } from '../../../../lib/api-utils';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id: Number(params.id) }
    });
    return new Response(JSON.stringify(neighborhood), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/neighborhood] GET error:', err);
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
    const neighborhood = await prisma.neighborhood.upsert({
      create: data,
      update: data,
      where: { id }
    });
    return new Response(JSON.stringify(neighborhood), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/neighborhood] PUT error:', err);
    return jsonError('Internal server error', 500);
  }
};

export const DELETE: APIRoute = async ({ request, params }) => {
  const authError = await requireAuth(request.headers);
  if (authError) return authError;

  try {
    const id = Number(params.id);
    await prisma.neighborhood.update({
      where: { id },
      data: { places: { set: [] } }
    });
    const deleted = await prisma.neighborhood.delete({ where: { id } });
    return new Response(JSON.stringify(deleted), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/neighborhood] DELETE error:', err);
    return jsonError('Internal server error', 500);
  }
};
