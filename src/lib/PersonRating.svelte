<script lang="ts">
  import { ratingStore } from './ratings.svelte';
  import type { Person } from './types';
  let { flavorId, person, compact = false }: { flavorId: string; person: Person; compact?: boolean } = $props();
  let label = $derived(person === 'filip' ? 'Filip' : 'Emilia');
  let initial = $derived(person === 'filip' ? 'F' : 'E');
  let value = $derived(ratingStore.for(flavorId)[person]);
</script>

<div class:compact class="person-rating">
  <div class="person-name"><span class:emilia={person === 'emilia'}>{initial}</span>{label}</div>
  <button class:checked={value.tastesGood} class="rate-button" onclick={() => ratingStore.update(flavorId, person, 'tastesGood')} aria-pressed={value.tastesGood}>
    <span class="check">{value.tastesGood ? '✓' : ''}</span> Smakuje
  </button>
  <button class:checked={value.exceptional} class="rate-button" onclick={() => ratingStore.update(flavorId, person, 'exceptional')} aria-pressed={value.exceptional}>
    <span class="check">{value.exceptional ? '✓' : ''}</span> Wyjątkowe
  </button>
  <button class:active-awful={value.awful} class="awful" onclick={() => ratingStore.update(flavorId, person, 'awful')} aria-pressed={value.awful} title="Oznacz jako okropny">{value.awful ? 'Wykluczony' : 'Okropny'}</button>
</div>
