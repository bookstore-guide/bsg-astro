import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma before importing the cache module
vi.mock('../lib/prisma', () => ({
  default: {
    place: {
      findMany: vi.fn()
    }
  }
}));

import prisma from '../lib/prisma';
import { getCachedPlaces, invalidatePlaceCache } from '../lib/place-cache';

const mockPlaces = [
  { id: 2, name: 'Zephyr', traits: [] },
  { id: 1, name: 'Atlas', traits: [] }
];

beforeEach(() => {
  invalidatePlaceCache();
  vi.clearAllMocks();
  (prisma.place.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockPlaces);
});

describe('getCachedPlaces', () => {
  it('fetches from db on first call', async () => {
    const result = await getCachedPlaces();
    expect(prisma.place.findMany).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
  });

  it('returns sorted results', async () => {
    const result = await getCachedPlaces();
    expect(result[0].name).toBe('Atlas');
    expect(result[1].name).toBe('Zephyr');
  });

  it('returns cached data on second call', async () => {
    await getCachedPlaces();
    await getCachedPlaces();
    expect(prisma.place.findMany).toHaveBeenCalledTimes(1);
  });

  it('re-fetches after invalidation', async () => {
    await getCachedPlaces();
    invalidatePlaceCache();
    await getCachedPlaces();
    expect(prisma.place.findMany).toHaveBeenCalledTimes(2);
  });
});

describe('invalidatePlaceCache', () => {
  it('causes the next call to hit the db', async () => {
    await getCachedPlaces();
    invalidatePlaceCache();
    await getCachedPlaces();
    expect(prisma.place.findMany).toHaveBeenCalledTimes(2);
  });
});
