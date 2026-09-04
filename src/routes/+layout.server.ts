import type { LayoutServerLoad } from './$types';
import { getRatings } from '$lib/server/ratings-repository';

export const load: LayoutServerLoad = async () => {
	try {
		return {
			ratings: await getRatings(),
			ratingsError: ''
		};
	} catch (error) {
		console.error('Failed to load ratings during SSR:', error);
		return {
			ratings: {},
			ratingsError: 'Nie udało się pobrać ocen z bazy.'
		};
	}
};
