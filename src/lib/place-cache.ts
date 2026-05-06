import type { Prisma } from '@prisma/client';
import prisma from './prisma';
import { preSortPlaces } from '../shared/utils';

const placeSelect = {
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
    where: { active: true },
    select: { name: true }
  },
  placetypes: {
    where: { active: true },
    select: { name: true }
  }
} satisfies Prisma.PlaceSelect;

type PublicPlace = Prisma.PlaceGetPayload<{ select: typeof placeSelect }>;

const CACHE_TTL_MS = 60_000;

let cache: { data: PublicPlace[]; expiresAt: number } | null = null;

export async function getCachedPlaces(): Promise<PublicPlace[]> {
  if (cache && Date.now() < cache.expiresAt) return cache.data;

  const places = await prisma.place.findMany({
    where: { active: true },
    select: placeSelect
  });

  const sorted = preSortPlaces(places) as PublicPlace[];
  cache = { data: sorted, expiresAt: Date.now() + CACHE_TTL_MS };
  return sorted;
}

export function invalidatePlaceCache(): void {
  cache = null;
}
