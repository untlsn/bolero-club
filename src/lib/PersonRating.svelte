<script lang="ts">
  import { ratingStore } from './ratings.svelte';
  import type { Person, RatingLevel } from './types';
  let { flavorId, person, compact = false }: { flavorId: string; person: Person; compact?: boolean } = $props();
  const levels: Array<{ id: RatingLevel; label: string }> = [
    { id: 'awful', label: 'Okropny' },
    { id: 'neutral', label: 'Neutralny' },
    { id: 'tasty', label: 'Smakuje' },
    { id: 'exceptional', label: 'Wyjątkowe' }
  ];
  let label = $derived(person === 'filip' ? 'Filip' : 'Emilia');
  let initial = $derived(person === 'filip' ? 'F' : 'E');
  let value = $derived(ratingStore.for(flavorId)[person]);
  let selected = $derived(ratingStore.level(value));
</script>

<div class:compact class="person-rating">
  <div class="person-name"><span class:emilia={person === 'emilia'}>{initial}</span>{label}</div>
  <div class="rating-scale" role="radiogroup" aria-label={`Ocena: ${label}`}>
    {#each levels as level}
      <button
        class={`rating-level ${level.id}`}
        class:active={selected === level.id}
        role="radio"
        aria-checked={selected === level.id}
        onclick={() => ratingStore.setLevel(flavorId, person, level.id)}
      ><span class="level-mark"></span><span>{level.label}</span></button>
    {/each}
  </div>
</div>
