import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Person, PersonRating } from '$lib/types';
import { flavorExists, getRatings, setPersonRating, setTried } from '$lib/server/ratings-repository';

const people: Person[] = ['filip', 'emilia'];

export const GET: RequestHandler = async () => json(await getRatings());

export const PATCH: RequestHandler = async ({ request }) => {
  const body = await request.json() as Record<string, unknown>;
  const flavorId = typeof body.flavorId === 'string' ? body.flavorId : '';
  if (!flavorId || !(await flavorExists(flavorId))) return json({ error: 'Nieznany smak.' }, { status: 400 });

  if (body.action === 'set-tried' && typeof body.tried === 'boolean') {
    await setTried(flavorId, body.tried);
    return json({ ok: true });
  }

  if (body.action === 'set-rating' && people.includes(body.person as Person)) {
    const rating = body.rating as Partial<PersonRating> | undefined;
    if (!rating || ['tastesGood', 'exceptional', 'awful'].some((field) => typeof rating[field as keyof PersonRating] !== 'boolean')) {
      return json({ error: 'Nieprawidłowa ocena.' }, { status: 400 });
    }
    await setPersonRating(flavorId, body.person as Person, rating as PersonRating);
    return json({ ok: true });
  }

  return json({ error: 'Nieprawidłowa operacja.' }, { status: 400 });
};
