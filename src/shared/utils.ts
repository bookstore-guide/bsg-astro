import type { Place } from "../../prisma/generated/prisma/client";

// sort places alphabetically by default, ignore "the"
export const preSortPlaces = (places: Partial<Place>[]) => {
  return places.sort((a, b) => {
    const place1 = a.name ?? '';
    const place2 = b.name ?? '';
    return place1.toLowerCase().replace(/^the /, '') > place2.toLowerCase().replace(/^the /, '')
      ? 1
      : -1;
  });
};

export const createSlug = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
