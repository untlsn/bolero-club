<script lang="ts">
  import { ratingStore } from './ratings.svelte';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Slider } from '$lib/components/ui/slider/index.js';
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
  let selectedLabel = $derived(levels.find((level) => level.id === selected)?.label ?? 'Nieoceniono');
  let selectedIndex = $derived(levels.findIndex((level) => level.id === selected));

  function setSelectedIndex(index: number) {
    const level = levels[index];
    if (level && level.id !== selected) void ratingStore.setLevel(flavorId, person, level.id);
  }
</script>

<div class:compact class="person-rating">
  <div class="person-name">
    <Avatar.Root size="sm">
      <Avatar.Fallback class={person === 'emilia' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}>{initial}</Avatar.Fallback>
    </Avatar.Root>
    {label}
    <strong class={`selected-level ${selected}`}>{selectedLabel}</strong>
  </div>
  <div class={`rating-slider ${selected ?? "unrated"}`}>
    <Slider
      type="single"
      class="max-w-[80vw]"
      value={Math.max(0, selectedIndex)}
      min={0}
      max={levels.length - 1}
      step={1}
      onValueChange={setSelectedIndex}
      aria-label={`Ocena: ${label}`}
      aria-valuetext={selectedLabel}
    />
    <div class="rating-stops">
      {#each levels as level, index}
        <button
          type="button"
          class="rating-stop-button"
          aria-label={`Ustaw ${label}: ${level.label}`}
          aria-pressed={selectedIndex === index}
          onclick={() => setSelectedIndex(index)}
        >
          {#if index > 0 && index < levels.length - 1 && selectedIndex !== index}<span aria-hidden="true"></span>{/if}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .rating-slider {
    --rating-color: #737a74;
    position: relative;
    width: min(100%, 80vw);
  }

  .rating-slider.unrated :global([data-slot='slider-thumb']),
  .rating-slider.unrated :global([data-slot='slider-range']) {
    opacity: 0;
  }

  .rating-slider.unrated :global([data-slot='slider-thumb']:focus-visible) {
    opacity: 1;
  }

  .rating-slider.awful {
    --rating-color: #dc4c5a;
  }

  .rating-slider.neutral {
    --rating-color: #737a74;
  }

  .rating-slider.tasty {
    --rating-color: #b6dc3b;
  }

  .rating-slider.exceptional {
    --rating-color: #176044;
  }

  .rating-slider :global([data-slot='slider-range']) {
    background: var(--rating-color);
    transition: background-color 180ms ease;
  }

  .rating-slider :global([data-slot='slider-thumb']) {
    z-index: 3;
    border: 2px solid var(--rating-color);
    box-shadow: 0 0 0 2px white;
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 120ms ease;
  }

  .rating-slider :global([data-slot='slider-thumb']:hover),
  .rating-slider :global([data-slot='slider-thumb']:focus-visible) {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rating-color) 28%, transparent);
  }

  .rating-stops {
    position: absolute;
    z-index: 4;
    top: 50%;
    right: -12px;
    left: -12px;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
  }

  .rating-stop-button {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    cursor: pointer;
    touch-action: manipulation;
  }

  .rating-stop-button span {
    width: 2px;
    height: 10px;
    border-radius: 999px;
    background: #aeb2ad;
    box-shadow: 0 0 0 1px rgb(255 255 255 / 80%);
    transition: background-color 180ms ease, transform 120ms ease;
  }

  .rating-stop-button:hover span,
  .rating-stop-button:focus-visible span {
    background: var(--rating-color);
    transform: scaleY(1.25);
  }

  .rating-stop-button:focus-visible {
    outline: 2px solid var(--rating-color);
    outline-offset: -7px;
  }
</style>
