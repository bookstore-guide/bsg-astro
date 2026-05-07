import type { APIRoute } from 'astro';
import { getCachedPlaces } from '../lib/place-cache';
import { createSlug } from '../shared/utils';

export const prerender = false;

const BASE = 'https://bookstore.guide';

function url(path: string): string {
  return `<url><loc>${BASE}${path}</loc></url>`;
}

export const GET: APIRoute = async () => {
  const places = await getCachedPlaces();

  const storeUrls = places.map((p) => url(`/store/${p.slug}/`));

  const traitSlugs = [
    ...new Set(places.flatMap((p) => p.traits.map((t) => t.name)).filter(Boolean))
  ].map((name) => createSlug(name!));

  const typeSlugs = [
    ...new Set(places.flatMap((p) => p.placetypes.map((t) => t.name)).filter(Boolean))
  ].map((name) => createSlug(name!));

  const tagUrls = traitSlugs.map((slug) => url(`/tag/${slug}/`));
  const typeUrls = typeSlugs.map((slug) => url(`/type/${slug}/`));

  // type+trait combos that have at least one result
  const typeTagUrls: string[] = [];
  for (const typeSlug of typeSlugs) {
    for (const tagSlug of traitSlugs) {
      const hasResults = places.some(
        (p) =>
          p.placetypes.some((t) => t.name && createSlug(t.name) === typeSlug) &&
          p.traits.some((t) => t.name && createSlug(t.name) === tagSlug)
      );
      if (hasResults) typeTagUrls.push(url(`/type/${typeSlug}/${tagSlug}/`));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url('/')}
${url('/about/')}
${storeUrls.join('\n')}
${tagUrls.join('\n')}
${typeUrls.join('\n')}
${typeTagUrls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
};
