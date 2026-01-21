import type { APIRoute } from 'astro';
import prisma from '../../lib/prisma';
import { preSortPlaces } from '../../shared/utils';

export const prerender = false;

export const GET: APIRoute = async () => {
  const places = await prisma.place.findMany({
    where: {
      active: true
    },
    select: {
      id: true,
      name: true,
      address1: true,
      address2: true,
      zip5: true,
      phone: true,
      longDescription: true,
      description: true,
      lat: true,
      lng: true,
      slug: true,
      hoursText: true,
      url: true,
      active: true,
      traits: {
        where: {
          active: true
        },
        select: {
          name: true
        }
      }
    }
  });

  console.error(places);

  const sortedPlaces = preSortPlaces(places);

  return new Response(JSON.stringify(sortedPlaces), {
    headers: { 'Content-Type': 'application/json' }
  });
};
