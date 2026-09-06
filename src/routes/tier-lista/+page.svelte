<script lang="ts">
  import { flavors, getShopUrl, getFlavorName } from '$lib/flavors';
  import * as Alert from '$lib/components/ui/alert/index.js';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Empty from '$lib/components/ui/empty/index.js';
  import { ratingStore } from '$lib/ratings.svelte';
  import type { Flavor, PersonRating, Tier } from '$lib/types';
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';

  type TierDefinition = { id: Tier; rank: string; label: string; icon: string; description: string };

  const tiers: TierDefinition[] = [
    { id: 'exceptional', rank: 'S', label: 'Wyjątkowe', icon: '✦', description: 'Smakuje i zdecydowanie ma w sobie to coś.' },
    { id: 'tasty', rank: 'A', label: 'Smaczne', icon: '♥', description: 'Dobre. Chętnie wypijemy je ponownie.' },
    { id: 'tried', rank: '?', label: 'Do oceny', icon: '…', description: 'Spróbowane, ale werdykt jeszcze nie zapadł.' },
    { id: 'untried', rank: '—', label: 'Niepróbowane', icon: '◷', description: 'Te smaki wciąż czekają na swoją kolej.' },
    { id: 'excluded', rank: 'X', label: 'Wykluczone', icon: '×', description: 'Ktoś nacisnął czerwony przycisk.' }
  ];

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
  {#if ratingStore.syncError}
    <Alert.Root class="db-error" variant="destructive">
      <CircleAlertIcon />
      <Alert.Title>Błąd synchronizacji</Alert.Title>
      <Alert.Description>{ratingStore.syncError}</Alert.Description>
    </Alert.Root>
  {/if}

  <section class="tier-hero">
    <p class="eyebrow">WERDYKT FILIPA I EMILII</p>
    <h1>Nasza tier lista</h1>
    <p>Ranking aktualizuje się automatycznie razem z Waszymi ocenami.</p>
    <Card.Root class="tier-stats flex-row" aria-label="Podsumowanie rankingu">
      <div><strong>{tried}</strong><span>spróbowanych</span></div>
      <div><strong>{grouped.exceptional.length}</strong><span>wyjątkowych</span></div>
      <div><strong>{grouped.excluded.length}</strong><span>wykluczonych</span></div>
    </Card.Root>
  </section>

  <section class="tier-board" aria-label="Tier lista smaków">
    {#each tiers as tier}
      <Card.Root class={`tier-section ${tier.id}`}>
        <header>
          <Badge class="tier-rank" variant={tier.id === 'excluded' ? 'destructive' : tier.id === 'untried' ? 'secondary' : 'default'}>{tier.rank}</Badge>
          <div class="tier-heading"><span>{tier.icon}</span><div><h2>{tier.label}</h2><p>{tier.description}</p></div></div>
          <Badge variant="secondary">{grouped[tier.id].length}</Badge>
        </header>

        <div class="tier-items" class:empty-tier={grouped[tier.id].length === 0}>
          {#each grouped[tier.id] as flavor (flavor.id)}
            <Card.Root size="sm" class="tier-flavor flex-row flex-wrap">
              <Avatar.Root><Avatar.Fallback class="tier-flavor-icon">{flavor.emoji}</Avatar.Fallback></Avatar.Root>
              <div class="tier-flavor-copy"><strong>{getFlavorName(flavor)}</strong><a href={getShopUrl(flavor)} target="_blank" rel="noreferrer">Sklep Bolero ↗</a></div>
              {#if tier.id !== 'untried'}
                <div class="tier-votes" aria-label={`Oceny smaku ${getFlavorName(flavor)}`}>
                  <Badge variant="secondary" class="vote-f" title="Filip">F <b>{verdict(ratingStore.for(flavor.id).filip)}</b></Badge>
                  <Badge variant="secondary" class="vote-e" title="Emilia">E <b>{verdict(ratingStore.for(flavor.id).emilia)}</b></Badge>
                </div>
              {/if}
              {#if ratingStore.for(flavor.id).comment}
                <p class="tier-comment">{ratingStore.for(flavor.id).comment}</p>
              {/if}
            </Card.Root>
          {:else}
            <Empty.Root class="tier-empty">
              <Empty.Header>
                <Empty.Media>{tier.icon}</Empty.Media>
                <Empty.Title>Na razie pusto</Empty.Title>
              </Empty.Header>
            </Empty.Root>
          {/each}
        </div>
      </Card.Root>
    {/each}
  </section>

  <div class="tier-actions"><Button href="/" variant="outline"><ArrowLeftIcon />Wróć do oceniania</Button></div>
</main>

<style>
  .tier-comment {
    flex-basis: 100%;
    min-width: 0;
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    color: var(--app-muted);
    font-size: 12px;
    line-height: 1.6;
  }
</style>
