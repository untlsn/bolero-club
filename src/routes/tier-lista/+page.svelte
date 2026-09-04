<script lang="ts">
  import { onMount } from 'svelte';
  import { flavors, getShopUrl } from '$lib/flavors';
  import { ratingStore } from '$lib/ratings.svelte';
  import type { Flavor, PersonRating, Tier } from '$lib/types';

  type TierDefinition = { id: Tier; rank: string; label: string; icon: string; description: string };

  const tiers: TierDefinition[] = [
    { id: 'exceptional', rank: 'S', label: 'Wyjątkowe', icon: '✦', description: 'Smakuje i zdecydowanie ma w sobie to coś.' },
    { id: 'tasty', rank: 'A', label: 'Smaczne', icon: '♥', description: 'Dobre. Chętnie wypijemy je ponownie.' },
    { id: 'tried', rank: '?', label: 'Do oceny', icon: '…', description: 'Spróbowane, ale werdykt jeszcze nie zapadł.' },
    { id: 'untried', rank: '—', label: 'Niepróbowane', icon: '◷', description: 'Te smaki wciąż czekają na swoją kolej.' },
    { id: 'excluded', rank: 'X', label: 'Wykluczone', icon: '×', description: 'Ktoś nacisnął czerwony przycisk.' }
  ];

  onMount(() => { void ratingStore.load(); });

  let grouped = $derived(Object.fromEntries(
    tiers.map((tier) => [tier.id, flavors.filter((flavor) => ratingStore.tier(flavor.id) === tier.id)])
  ) as Record<Tier, Flavor[]>);
  let tried = $derived(ratingStore.triedCount());

  function verdict(rating: PersonRating) {
    if (rating.awful) return '×';
    if (rating.exceptional) return '✦';
    if (rating.tastesGood) return '♥';
    return '–';
  }
</script>

<svelte:head><title>Tier lista · Bolero Club</title></svelte:head>

<main class="tier-page">
  {#if ratingStore.syncError}<div class="db-error" role="alert">{ratingStore.syncError}</div>{/if}

  <section class="tier-hero">
    <p class="eyebrow">WERDYKT FILIPA I EMILII</p>
    <h1>Nasza tier lista</h1>
    <p>Ranking aktualizuje się automatycznie razem z Waszymi ocenami.</p>
    <div class="tier-stats" aria-label="Podsumowanie rankingu">
      <div><strong>{tried}</strong><span>spróbowanych</span></div>
      <div><strong>{grouped.exceptional.length}</strong><span>wyjątkowych</span></div>
      <div><strong>{grouped.excluded.length}</strong><span>wykluczonych</span></div>
    </div>
  </section>

  <section class="tier-board" aria-label="Tier lista smaków">
    {#each tiers as tier}
      <article class={`tier-section ${tier.id}`}>
        <header>
          <div class="tier-rank">{tier.rank}</div>
          <div class="tier-heading"><span>{tier.icon}</span><div><h2>{tier.label}</h2><p>{tier.description}</p></div></div>
          <strong>{grouped[tier.id].length}</strong>
        </header>

        <div class="tier-items" class:empty-tier={grouped[tier.id].length === 0}>
          {#each grouped[tier.id] as flavor (flavor.id)}
            <div class="tier-flavor">
              <span class="tier-flavor-icon">{flavor.emoji}</span>
              <div class="tier-flavor-copy"><strong>{flavor.original}</strong><a href={getShopUrl(flavor)} target="_blank" rel="noreferrer">Sklep Bolero ↗</a></div>
              {#if tier.id !== 'untried'}
                <div class="tier-votes" aria-label={`Oceny smaku ${flavor.original}`}>
                  <i class="vote-f" title="Filip">F <b>{verdict(ratingStore.for(flavor.id).filip)}</b></i>
                  <i class="vote-e" title="Emilia">E <b>{verdict(ratingStore.for(flavor.id).emilia)}</b></i>
                </div>
              {/if}
            </div>
          {:else}
            <div class="tier-empty"><span>{tier.icon}</span><p>Na razie pusto</p></div>
          {/each}
        </div>
      </article>
    {/each}
  </section>

  <div class="tier-actions"><a href="/">← Wróć do oceniania</a></div>
</main>
