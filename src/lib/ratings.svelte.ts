import { browser } from '$app/environment';
import { flavors } from './flavors';
import type { FlavorRating, Person, PersonRating, Ratings, Tier } from './types';

const STORAGE_KEY = 'bolero-ratings-v1';
const emptyPerson = (): PersonRating => ({ tastesGood: false, exceptional: false, awful: false });
const emptyFlavor = (): FlavorRating => ({ filip: emptyPerson(), emilia: emptyPerson(), tried: false });

function read(): Ratings {
  if (!browser) return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Ratings; }
  catch { return {}; }
}

let ratings = $state<Ratings>(read());

export const ratingStore = {
  get ratings() { return ratings; },
  for(flavorId: string): FlavorRating { return ratings[flavorId] ?? emptyFlavor(); },
  isTried(flavorId: string): boolean {
    const rating = ratings[flavorId];
    if (!rating) return false;
    return rating.tried ?? [rating.filip, rating.emilia].some((person) => person.tastesGood || person.exceptional || person.awful);
  },
  markTried(flavorId: string, tried: boolean) {
    ratings = tried
      ? { ...ratings, [flavorId]: { ...(ratings[flavorId] ?? emptyFlavor()), tried: true } }
      : { ...ratings, [flavorId]: emptyFlavor() };
    if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  },
  update(flavorId: string, person: Person, field: keyof PersonRating) {
    const current = ratings[flavorId] ?? emptyFlavor();
    const nextPerson = { ...current[person], [field]: !current[person][field] };
    if (field === 'exceptional' && nextPerson.exceptional) { nextPerson.tastesGood = true; nextPerson.awful = false; }
    if (field === 'tastesGood' && !nextPerson.tastesGood) nextPerson.exceptional = false;
    if (field === 'tastesGood' && nextPerson.tastesGood) nextPerson.awful = false;
    if (field === 'awful' && nextPerson.awful) { nextPerson.tastesGood = false; nextPerson.exceptional = false; }
    ratings = { ...ratings, [flavorId]: { ...current, tried: true, [person]: nextPerson } };
    if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
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
  reset() {
    ratings = {};
    if (browser) localStorage.removeItem(STORAGE_KEY);
  },
  triedCount() { return flavors.filter((flavor) => this.isTried(flavor.id)).length; }
};
