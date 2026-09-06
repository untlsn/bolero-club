export type Person = 'filip' | 'emilia';
export type RatingLevel = 'awful' | 'neutral' | 'tasty' | 'exceptional';

export type PersonRating = {
  rated: boolean;
  tastesGood: boolean;
  exceptional: boolean;
  awful: boolean;
};

export type FlavorRating = Record<Person, PersonRating> & { tried: boolean; comment: string };
export type Ratings = Record<string, FlavorRating>;

export type Flavor = {
  id: string;
  name: string;
  original: string;
  family: 'owocowe' | 'cytrusowe' | 'egzotyczne' | 'deserowe' | 'inne' | 'energetyki';
  emoji: string;
};

export type Tier = 'exceptional' | 'tasty' | 'tried' | 'untried' | 'excluded';
