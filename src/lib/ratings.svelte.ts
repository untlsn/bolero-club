import { flavors } from './flavors';
import type { FlavorRating, Person, PersonRating, Ratings, Tier } from './types';

const emptyPerson = (): PersonRating => ({ tastesGood: false, exceptional: false, awful: false });
const emptyFlavor = (): FlavorRating => ({ filip: emptyPerson(), emilia: emptyPerson(), tried: false });

let ratings = $state<Ratings>({});
let loaded = $state(false);
let syncError = $state('');

async function request(input?: RequestInit): Promise<Ratings | void> {
  const response = await fetch('/api/ratings', input);
  if (!response.ok) throw new Error('Nie udało się zapisać zmian w bazie.');
  if (!input) return response.json() as Promise<Ratings>;
}

export const ratingStore = {
  get ratings() { return ratings; },
  get loaded() { return loaded; },
  get syncError() { return syncError; },
  async load() {
    try {
      ratings = (await request() as Ratings) ?? {};
      syncError = '';
    } catch (error) {
      syncError = error instanceof Error ? error.message : 'Nie udało się połączyć z bazą.';
    } finally {
      loaded = true;
    }
  },
  for(flavorId: string): FlavorRating { return ratings[flavorId] ?? emptyFlavor(); },
  isTried(flavorId: string): boolean { return ratings[flavorId]?.tried ?? false; },
  async markTried(flavorId: string, tried: boolean) {
    const previous = ratings;
    ratings = tried
      ? { ...ratings, [flavorId]: { ...(ratings[flavorId] ?? emptyFlavor()), tried: true } }
      : Object.fromEntries(Object.entries(ratings).filter(([id]) => id !== flavorId));
    try {
      await request({
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'set-tried', flavorId, tried })
      });
      syncError = '';
    } catch (error) {
      ratings = previous;
      syncError = error instanceof Error ? error.message : 'Nie udało się zapisać zmian.';
    }
  },
  async update(flavorId: string, person: Person, field: keyof PersonRating) {
    const previous = ratings;
    const current = ratings[flavorId] ?? emptyFlavor();
    const nextPerson = { ...current[person], [field]: !current[person][field] };
    if (field === 'exceptional' && nextPerson.exceptional) { nextPerson.tastesGood = true; nextPerson.awful = false; }
    if (field === 'tastesGood' && !nextPerson.tastesGood) nextPerson.exceptional = false;
    if (field === 'tastesGood' && nextPerson.tastesGood) nextPerson.awful = false;
    if (field === 'awful' && nextPerson.awful) { nextPerson.tastesGood = false; nextPerson.exceptional = false; }
    ratings = { ...ratings, [flavorId]: { ...current, tried: true, [person]: nextPerson } };
    try {
      await request({
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'set-rating', flavorId, person, rating: nextPerson })
      });
      syncError = '';
    } catch (error) {
      ratings = previous;
      syncError = error instanceof Error ? error.message : 'Nie udało się zapisać zmian.';
    }
  },
  tier(flavorId: string): Tier {
    const r = ratings[flavorId] ?? emptyFlavor();
    const people = [r.filip, r.emilia];
    if (!this.isTried(flavorId)) return 'untried';
    if (people.some((person) => person.awful)) return 'excluded';
    if (people.some((person) => person.tastesGood && person.exceptional)) return 'exceptional';
    if (people.some((person) => person.tastesGood)) return 'tasty';
    return 'tried';
  },
  triedCount() { return flavors.filter((flavor) => this.isTried(flavor.id)).length; }
};
