import { eq } from 'drizzle-orm';
import { flavors } from '$lib/flavors';
import type { Person, PersonRating, Ratings } from '$lib/types';
import { db } from './db';
import { commentsTable, flavorsTable, ratingsTable, tastingsTable } from './db/schema';

const emptyPerson = (): PersonRating => ({ rated: false, tastesGood: false, exceptional: false, awful: false });

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
  const [tastings, personRatings, comments] = await Promise.all([
    db.select().from(tastingsTable),
    db.select().from(ratingsTable),
    db.select().from(commentsTable)
  ]);

  const result: Ratings = {};
  for (const tasting of tastings) {
    if (tasting.tried) result[tasting.flavorId] = { tried: true, comment: '', filip: emptyPerson(), emilia: emptyPerson() };
  }
  for (const rating of personRatings) {
    const flavor = result[rating.flavorId] ?? { tried: true, comment: '', filip: emptyPerson(), emilia: emptyPerson() };
    flavor[rating.person] = {
      rated: true,
      tastesGood: rating.tastesGood,
      exceptional: rating.exceptional,
      awful: rating.awful
    };
    result[rating.flavorId] = flavor;
  }
  for (const { flavorId, comment } of comments) {
    result[flavorId] = { ...(result[flavorId] ?? { tried: false, filip: emptyPerson(), emilia: emptyPerson() }), comment };
  }
  return result;
}

export async function setComment(flavorId: string, comment: string) {
  await seedFlavors();
  if (!comment) {
    await db.delete(commentsTable).where(eq(commentsTable.flavorId, flavorId));
    return;
  }
  const updatedAt = new Date();
  await db.insert(commentsTable).values({ flavorId, comment, updatedAt })
    .onConflictDoUpdate({ target: commentsTable.flavorId, set: { comment, updatedAt } });
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
  const storedRating = { tastesGood: rating.tastesGood, exceptional: rating.exceptional, awful: rating.awful };
  await db.transaction(async (tx) => {
    await tx.insert(tastingsTable).values({ flavorId, tried: true, updatedAt: now })
      .onConflictDoUpdate({ target: tastingsTable.flavorId, set: { tried: true, updatedAt: now } });
    await tx.insert(ratingsTable).values({ flavorId, person, ...storedRating, updatedAt: now })
      .onConflictDoUpdate({
        target: [ratingsTable.flavorId, ratingsTable.person],
        set: { ...storedRating, updatedAt: now }
      });
  });
}

export async function flavorExists(flavorId: string) {
  await seedFlavors();
  const row = await db.select({ id: flavorsTable.id }).from(flavorsTable)
    .where(eq(flavorsTable.id, flavorId)).limit(1);
  return row.length === 1;
}
