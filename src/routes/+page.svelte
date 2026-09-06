<script lang="ts">
  import { flavors, familyLabels, getShopUrl, getFlavorName } from '$lib/flavors';
  import PersonRating from '$lib/PersonRating.svelte';
  import FlavorComment from '$lib/FlavorComment.svelte';
  import * as Alert from '$lib/components/ui/alert/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Empty from '$lib/components/ui/empty/index.js';
  import * as InputGroup from '$lib/components/ui/input-group/index.js';
  import { Progress } from '$lib/components/ui/progress/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { ratingStore } from '$lib/ratings.svelte';
  import type { Flavor } from '$lib/types';
  import CheckIcon from '@lucide/svelte/icons/check';
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
  import Undo2Icon from '@lucide/svelte/icons/undo-2';
  import SearchIcon from '@lucide/svelte/icons/search';

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
  {#if ratingStore.syncError}
    <Alert.Root class="db-error" variant="destructive">
      <CircleAlertIcon />
      <Alert.Title>Błąd synchronizacji</Alert.Title>
      <Alert.Description>{ratingStore.syncError}</Alert.Description>
    </Alert.Root>
  {/if}
  <section class="hero">
    <div><p class="eyebrow">PRYWATNY RANKING SMAKÓW</p><h1>Znajdźmy nasze<br/><span>Bolero idealne.</span></h1><p class="lead">Dwie opinie, jeden bezlitosny ranking. Zaznaczcie, co smakuje — resztą zajmiemy się my.</p></div>
    <Card.Root class="progress-card">
      <div class="progress-top"><span>Wspólny postęp</span><strong>{Math.round((tried / flavors.length) * 100)}%</strong></div>
      <Progress value={tried} max={flavors.length} class="progress-track bg-white/15 [&_[data-slot=progress-indicator]]:bg-lime-300" />
      <p><strong>{tried}</strong> z {flavors.length} smaków spróbowanych</p>
      <Button href="/tier-lista" variant="ghost" class="progress-link">Zobacz aktualny ranking <span>→</span></Button>
    </Card.Root>
  </section>

  <Card.Root class="controls flex-row" aria-label="Filtrowanie smaków">
    <InputGroup.Root class="search-field">
      <InputGroup.Input bind:value={query} placeholder="Szukaj smaku…" aria-label="Szukaj smaku" />
      <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
    </InputGroup.Root>
    <Select.Root type="single" bind:value={family}>
      <Select.Trigger class="family-select" aria-label="Rodzina smaków">
        {family === 'wszystkie' ? 'Wszystkie rodzaje' : familyLabels[family]}
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="wszystkie">Wszystkie rodzaje</Select.Item>
        {#each Object.entries(familyLabels) as [key, label]}
          <Select.Item value={key}>{label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <Tabs.Root bind:value={status} class="status-filter">
      <Tabs.List class="w-full">
        <Tabs.Trigger value="wszystkie">Wszystkie</Tabs.Trigger>
        <Tabs.Trigger value="ocenione">Ocenione</Tabs.Trigger>
        <Tabs.Trigger value="nieprobowane">Niepróbowane</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  </Card.Root>

  <div class="list-heading"><p><Badge variant="secondary">{filtered.length}</Badge> {filtered.length === 1 ? 'smak' : 'smaków'}</p><div><span class="legend-dot filip"></span>Filip <span class="legend-dot emilia"></span>Emilia</div></div>

  <section class="flavor-list">
    {#each filtered as flavor (flavor.id)}
      <Card.Root
        size="sm"
        class={`flavor-row ${ratingStore.isTried(flavor.id) ? 'expanded' : ''} ${ratingStore.tier(flavor.id) === 'excluded' ? 'excluded' : ''}`}
      >
        <div class="flavor-summary">
          <div class="flavor-identity">
            <div class={`flavor-icon ${flavor.family}`}>{flavor.emoji}</div>
            <div class="flavor-copy"><h2>{getFlavorName(flavor)}</h2><a href={getShopUrl(flavor)} target="_blank" rel="noreferrer">Sklep Bolero <span aria-hidden="true">↗</span></a></div>
          </div>
          <Button
            variant={ratingStore.isTried(flavor.id) ? 'outline' : 'default'}
            size="sm"
            class={ratingStore.isTried(flavor.id) ? undefined : 'bg-lime-300 text-lime-950 hover:bg-lime-400'}
            onclick={() => ratingStore.markTried(flavor.id, !ratingStore.isTried(flavor.id))}
            aria-expanded={ratingStore.isTried(flavor.id)}
            aria-controls={`rating-${flavor.id}`}
          >
            {#if ratingStore.isTried(flavor.id)}<Undo2Icon />{:else}<CheckIcon />{/if}
            {ratingStore.isTried(flavor.id) ? 'Cofnij' : 'Oceń'}
          </Button>
        </div>
        <div
          class:open={ratingStore.isTried(flavor.id)}
          class="ratings-collapse"
          aria-hidden={!ratingStore.isTried(flavor.id)}
          inert={!ratingStore.isTried(flavor.id)}
        >
          <div class="ratings-shell">
            <Separator class="rating-separator" />
            <div class="ratings" id={`rating-${flavor.id}`}><PersonRating flavorId={flavor.id} person="filip"/><PersonRating flavorId={flavor.id} person="emilia"/></div>
          </div>
        </div>
        <FlavorComment flavorId={flavor.id} flavorName={getFlavorName(flavor)} />
      </Card.Root>
    {:else}
      <Empty.Root class="empty">
        <Empty.Header>
          <Empty.Media>🍋</Empty.Media>
          <Empty.Title>Nie znaleźliśmy takiego smaku</Empty.Title>
          <Empty.Description>Zmień wyszukiwanie albo wyczyść filtry.</Empty.Description>
        </Empty.Header>
      </Empty.Root>
    {/each}
  </section>
</main>
