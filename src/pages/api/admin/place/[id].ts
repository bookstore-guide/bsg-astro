import type { APIRoute } from 'astro';
import type { PlaceType, Trait, Neighborhood } from '@prisma/client';
import prisma from '../../../../lib/prisma';
import { requireAuth, jsonError } from '../../../../lib/api-utils';
import { invalidatePlaceCache } from '../../../../lib/place-cache';
import { createSlug } from '../../../../shared/utils';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const place = await prisma.place.findUnique({
      where: { id: Number(id) },
      include: {
        traits: { where: { active: true } },
        placetypes: { where: { active: true } },
        neighborhoods: true
      }
    });
    return new Response(JSON.stringify(place), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/place] GET error:', err);
    return jsonError('Internal server error', 500);
  }
};

export const PUT: APIRoute = async ({ request, params }) => {
  const authError = await requireAuth(request.headers);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id } = params;
    const post = await prisma.place.upsert({
      create: {
        name: body.name,
        address1: body.address1,
        address2: body.address2,
        zip5: body.zip5,
        phone: body.phone,
        description: body.description,
        longDescription: body.longDescription,
        internalNotes: body.internalNotes,
        active: body.active,
        lat: body.lat,
        lng: body.lng,
        slug: createSlug(body.name),
        hoursText: body.hoursText,
        url: body.url,
        traits: {
          connect: body.traits.map((trait: Trait) => ({ id: trait.id }))
        },
        placetypes: {
          connect: body.placetypes.map((type: PlaceType) => ({ id: type.id }))
        },
        neighborhoods: {
          connect: body.neighborhoods.map((n: Neighborhood) => ({ id: n.id }))
        }
      },
      update: {
        name: body.name,
        address1: body.address1,
        address2: body.address2,
        zip5: body.zip5,
        phone: body.phone,
        description: body.description,
        longDescription: body.longDescription,
        internalNotes: body.internalNotes,
        active: body.active,
        lat: body.lat,
        lng: body.lng,
        slug: createSlug(body.name),
        hoursText: body.hoursText,
        url: body.url,
        traits: {
          set: [],
          connect: body.traits.map((trait: Trait) => ({ id: trait.id }))
        },
        placetypes: {
          set: [],
          connect: body.placetypes.map((type: PlaceType) => ({ id: type.id }))
        },
        neighborhoods: {
          set: [],
          connect: body.neighborhoods.map((n: Neighborhood) => ({ id: n.id }))
        }
      },
      where: { id: Number(id) }
    });
    invalidatePlaceCache();
    return new Response(JSON.stringify(post), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/place] PUT error:', err);
    return jsonError('Internal server error', 500);
  }
};

export const DELETE: APIRoute = async ({ request, params }) => {
  const authError = await requireAuth(request.headers);
  if (authError) return authError;

  try {
    const id = Number(params.id);

    const placeTraitsToDisconnect = prisma.place.update({
      where: { id },
      data: { traits: { set: [] } }
    });

    const placeTypesToDisconnect = prisma.place.update({
      where: { id },
      data: { placetypes: { set: [] } }
    });

    const placeNeighborhoodsToDisconnect = prisma.place.update({
      where: { id },
      data: { neighborhoods: { set: [] } }
    });

    const deletedPlace = prisma.place.delete({ where: { id } });

    await prisma.$transaction([
      placeTraitsToDisconnect,
      placeTypesToDisconnect,
      placeNeighborhoodsToDisconnect,
      deletedPlace
    ]);
    invalidatePlaceCache();

    return new Response(JSON.stringify({ id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[api/admin/place] DELETE error:', err);
    return jsonError('Internal server error', 500);
  }
};
