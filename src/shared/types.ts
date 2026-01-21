// types defined here are modifications of Prisma types for use on the API and FE
import type { Place as PrismaPlace, Trait as PrismaTrait, PlaceType as PrismaPlaceType } from '@prisma/client';

type DatabaseGenerated = 'createdAt' | 'updatedAt';

export type Place = Omit<PrismaPlace, DatabaseGenerated>;
export type PlaceType = Omit<PrismaPlaceType, DatabaseGenerated>;
export type Trait = Omit<PrismaTrait, DatabaseGenerated>;

export type PlaceWithTraits = Place & { traits: Trait[] };

export type PlaceWithTraitsAndTypes = PlaceWithTraits & { placetypes: PlaceType[] };

export type Store = Readonly<Omit<PlaceWithTraits, 'internalNotes' | 'active'>>;
