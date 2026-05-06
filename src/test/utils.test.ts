import { describe, it, expect } from 'vitest';
import { preSortPlaces, createSlug } from '../shared/utils';
import type { Place } from '@prisma/client';

describe('preSortPlaces', () => {
  const place = (name: string): Partial<Place> => ({ name });

  it('sorts alphabetically', () => {
    const result = preSortPlaces([place('Zephyr'), place('Atlas'), place('Beacon')]);
    expect(result.map((p) => p.name)).toEqual(['Atlas', 'Beacon', 'Zephyr']);
  });

  it('ignores leading "the" when sorting', () => {
    const result = preSortPlaces([place('The Anchor'), place('Beacon'), place('The Alley')]);
    expect(result.map((p) => p.name)).toEqual(['The Alley', 'The Anchor', 'Beacon']);
  });

  it('is case-insensitive', () => {
    const result = preSortPlaces([place('zebra'), place('Apple'), place('mango')]);
    expect(result.map((p) => p.name)).toEqual(['Apple', 'mango', 'zebra']);
  });

  it('handles empty list', () => {
    expect(preSortPlaces([])).toEqual([]);
  });

  it('handles places with null names', () => {
    const result = preSortPlaces([place('Beta'), { name: null }]);
    expect(result).toHaveLength(2);
  });
});

describe('createSlug', () => {
  it('lowercases and trims', () => {
    expect(createSlug('  Hello World  ')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(createSlug('Green Apple Cafe')).toBe('green-apple-cafe');
  });

  it('removes special characters', () => {
    expect(createSlug("Pete's Coffee & Tea!")).toBe('petes-coffee-tea');
  });

  it('collapses multiple hyphens', () => {
    expect(createSlug('foo  --  bar')).toBe('foo-bar');
  });

  it('strips leading and trailing hyphens', () => {
    expect(createSlug('---hello---')).toBe('hello');
  });
});
