import type { APIRoute } from 'astro';
import type { PlaceType, Trait } from '@prisma/client';
import prisma from '../../../../lib/prisma';
import { auth } from '../../../../lib/auth';
import { createSlug } from '../../../../shared/utils';

export const prerender = false;

// currently there is only one user & that user is an admin
const isLoggedIn = async (headers: Headers) => {
  const session = await auth.api.getSession({
    headers: headers
  });
  const loggedIn = session?.user !== undefined;
  return loggedIn;
};

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  const place = await prisma.place.findUnique({
    where: { id: Number(id) },
    include: {
      traits: {
        where: {
          active: true
        }
      },
      placetypes: {
        where: {
          active: true
        }
      }
    }
  });
  return new Response(JSON.stringify(place), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const PUT: APIRoute = async ({ request, params }) => {
  const authed = isLoggedIn(request.headers);
  if (!authed) {
    return new Response('Access not allowed', { status: 403 });
  }
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
        connect: body.traits.map((trait: Trait) => ({
          id: trait.id
        }))
      },
      placetypes:{
        connect: body.placetypes.map((type: PlaceType) => ({
          id: type.id
        }))
      },
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
        connect: body.traits.map((trait: Trait) => ({
          id: trait.id
        }))
      },
      placetypes: {
        set: [],
        connect: body.placetypes.map((type: PlaceType) => ({
          id: type.id
        }))
      }
    },
    where: { id: Number(id) }
  });
  return new Response(JSON.stringify(post), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const DELETE: APIRoute = async ({ request, params }) => {
  const authed = isLoggedIn(request.headers);
  if (!authed) {
    return new Response('Access not allowed', { status: 403 });
  }
  const id = Number(params.id);

  const placeTraitsToDisconnect = prisma.place.update({
    where: {
      id
    },
    data: {
      traits: { set: [] }
    }
  });

  const placeTypesToDisconnect = prisma.place.update({
    where: {
      id
    },
    data: {
      placetypes: { set: [] }
    }
  });

  const deletedPlace = prisma.place.delete({
    where: {
      id
    }
  });
  
  await prisma.$transaction([placeTraitsToDisconnect, placeTypesToDisconnect, deletedPlace]);

  return new Response(JSON.stringify(deletedPlace), {
    headers: { 'Content-Type': 'application/json' }
  });
};
