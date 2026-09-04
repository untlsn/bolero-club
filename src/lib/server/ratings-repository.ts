import { eq } from 'drizzle-orm';
import { flavors } from '$lib/flavors';
import type { Person, PersonRating, Ratings } from '$lib/types';
import { db } from './db';
import { flavorsTable, ratingsTable, tastingsTable } from './db/schema';

const emptyPerson = (): PersonRating => ({ tastesGood: false, exceptional: false, awful: false });

export async function seedFlavors() {
  await db.insert(flavorsTable).values(flavors.map((flavor) => ({
    id: flavor.id,
    name: flavor.name,
    originalName: flavor.original,
    family: flavor.family,
    emoji: flavor.emoji
  }))).onConflictDoNothing();
}

export async function getRatings(): Promise<Ratings> {
  await seedFlavors();
  const [tastings, personRatings] = await Promise.all([
    db.select().from(tastingsTable),
    db.select().from(ratingsTable)
  ]);

  const result: Ratings = {};
  for (const tasting of tastings) {
    if (tasting.tried) result[tasting.flavorId] = { tried: true, filip: emptyPerson(), emilia: emptyPerson() };
  }
  for (const rating of personRatings) {
    const flavor = result[rating.flavorId] ?? { tried: true, filip: emptyPerson(), emilia: emptyPerson() };
    flavor[rating.person] = {
      tastesGood: rating.tastesGood,
      exceptional: rating.exceptional,
      awful: rating.awful
    };
    result[rating.flavorId] = flavor;
  }
  return result;
}

export async function setTried(flavorId: string, tried: boolean) {
  await seedFlavors();
  if (tried) {
    await db.insert(tastingsTable).values({ flavorId, tried: true, updatedAt: new Date() })
      .onConflictDoUpdate({ target: tastingsTable.flavorId, set: { tried: true, updatedAt: new Date() } });
    return;
  }

  await db.transaction(async (tx) => {
    await tx.delete(ratingsTable).where(eq(ratingsTable.flavorId, flavorId));
    await tx.delete(tastingsTable).where(eq(tastingsTable.flavorId, flavorId));
  });
}

export async function setPersonRating(flavorId: string, person: Person, rating: PersonRating) {
  await seedFlavors();
  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.insert(tastingsTable).values({ flavorId, tried: true, updatedAt: now })
      .onConflictDoUpdate({ target: tastingsTable.flavorId, set: { tried: true, updatedAt: now } });
    await tx.insert(ratingsTable).values({ flavorId, person, ...rating, updatedAt: now })
      .onConflictDoUpdate({
        target: [ratingsTable.flavorId, ratingsTable.person],
        set: { ...rating, updatedAt: now }
      });
  });
}

export async function flavorExists(flavorId: string) {
  await seedFlavors();
  const row = await db.select({ id: flavorsTable.id }).from(flavorsTable)
    .where(eq(flavorsTable.id, flavorId)).limit(1);
  return row.length === 1;
}
