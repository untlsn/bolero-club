<script lang="ts">
  import { flavors, familyLabels, getShopUrl } from '$lib/flavors';
  import PersonRating from '$lib/PersonRating.svelte';
  import Search from '$lib/icons/Search.svelte';
  import { ratingStore } from '$lib/ratings.svelte';
  import type { Flavor } from '$lib/types';
  import { onMount } from 'svelte';

  onMount(() => { void ratingStore.load(); });

  let query = $state('');
  let family = $state<'wszystkie' | Flavor['family']>('wszystkie');
  let status = $state<'wszystkie' | 'ocenione' | 'nieprobowane'>('wszystkie');
  let filtered = $derived(flavors.filter((flavor) => {
    const matchesQuery = `${flavor.name} ${flavor.original}`.toLocaleLowerCase('pl').includes(query.toLocaleLowerCase('pl'));
    const matchesFamily = family === 'wszystkie' || flavor.family === family;
    const tried = ratingStore.isTried(flavor.id);
    const matchesStatus = status === 'wszystkie' || (status === 'ocenione' ? tried : !tried);
    return matchesQuery && matchesFamily && matchesStatus;
  }));
  let tried = $derived(ratingStore.triedCount());
</script>

<main>
  {#if ratingStore.syncError}<div class="db-error" role="alert">{ratingStore.syncError}</div>{/if}
  <section class="hero">
    <div><p class="eyebrow">PRYWATNY RANKING SMAKÓW</p><h1>Znajdźmy nasze<br/><span>Bolero idealne.</span></h1><p class="lead">Dwie opinie, jeden bezlitosny ranking. Zaznaczcie, co smakuje — resztą zajmiemy się my.</p></div>
    <div class="progress-card">
      <div class="progress-top"><span>Wspólny postęp</span><strong>{Math.round((tried / flavors.length) * 100)}%</strong></div>
      <div class="progress-track"><span style={`width: ${(tried / flavors.length) * 100}%`}></span></div>
      <p><strong>{tried}</strong> z {flavors.length} smaków spróbowanych</p>
      <a href="/tier-lista">Zobacz aktualny ranking <span>→</span></a>
    </div>
  </section>

  <section class="controls" aria-label="Filtrowanie smaków">
    <label class="search"><Search size={19}/><input bind:value={query} placeholder="Szukaj smaku…" /></label>
    <select bind:value={family} aria-label="Rodzina smaków"><option value="wszystkie">Wszystkie rodzaje</option>{#each Object.entries(familyLabels) as [key, label]}<option value={key}>{label}</option>{/each}</select>
    <div class="status-tabs"><button class:active={status === 'wszystkie'} onclick={() => status = 'wszystkie'}>Wszystkie</button><button class:active={status === 'ocenione'} onclick={() => status = 'ocenione'}>Ocenione</button><button class:active={status === 'nieprobowane'} onclick={() => status = 'nieprobowane'}>Niepróbowane</button></div>
  </section>

  <div class="list-heading"><p><strong>{filtered.length}</strong> {filtered.length === 1 ? 'smak' : 'smaków'}</p><div><span class="legend-dot filip"></span>Filip <span class="legend-dot emilia"></span>Emilia</div></div>

  <section class="flavor-list">
    {#each filtered as flavor (flavor.id)}
      <article class:expanded={ratingStore.isTried(flavor.id)} class:excluded={ratingStore.tier(flavor.id) === 'excluded'} class="flavor-row">
        <div class="flavor-summary">
          <div class="flavor-identity">
            <div class={`flavor-icon ${flavor.family}`}>{flavor.emoji}</div>
            <div class="flavor-copy"><h2>{flavor.original}</h2><a href={getShopUrl(flavor)} target="_blank" rel="noreferrer">Sklep Bolero <span aria-hidden="true">↗</span></a></div>
          </div>
          <button
            class="tried-button"
            class:opened={ratingStore.isTried(flavor.id)}
            onclick={() => ratingStore.markTried(flavor.id, !ratingStore.isTried(flavor.id))}
            aria-expanded={ratingStore.isTried(flavor.id)}
            aria-controls={`rating-${flavor.id}`}
          ><span>{ratingStore.isTried(flavor.id) ? '−' : '✓'}</span>{ratingStore.isTried(flavor.id) ? 'Oznacz jako niespróbowany' : 'Oceń'}</button>
        </div>
        {#if ratingStore.isTried(flavor.id)}
          <div class="ratings" id={`rating-${flavor.id}`}><PersonRating flavorId={flavor.id} person="filip"/><PersonRating flavorId={flavor.id} person="emilia"/></div>
        {/if}
      </article>
    {:else}
      <div class="empty"><span>🍋</span><h2>Nie znaleźliśmy takiego smaku</h2><p>Zmień wyszukiwanie albo wyczyść filtry.</p></div>
    {/each}
  </section>
</main>
