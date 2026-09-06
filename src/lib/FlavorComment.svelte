<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { ratingStore } from '$lib/ratings.svelte';

  let { flavorId, flavorName }: { flavorId: string; flavorName: string } = $props();
  let saved = $derived(ratingStore.for(flavorId).comment);
  let draft = $state<string | null>(null);
  let value = $derived(draft ?? saved);
  let saving = $state(false);
  let message = $state('');
  let failed = $state(false);

  async function save(event: SubmitEvent) {
    event.preventDefault();
    saving = true;
    message = '';
    failed = false;
    try {
      await ratingStore.setComment(flavorId, value);
      draft = null;
      message = value ? 'Komentarz zapisany.' : 'Komentarz usunięty.';
    } catch {
      failed = true;
      message = 'Nie udało się zapisać komentarza. Spróbuj ponownie.';
    } finally {
      saving = false;
    }
  }
</script>

<div class="comment">
  {#if saved}<p class="saved-comment">{saved}</p>{/if}
  <details>
    <summary>{saved ? 'Edytuj komentarz' : 'Dodaj komentarz'}</summary>
    <form onsubmit={save}>
      <label for={`comment-${flavorId}`}>Komentarz do smaku {flavorName}</label>
      <Textarea
        id={`comment-${flavorId}`}
        {value}
        oninput={(event) => { draft = event.currentTarget.value; message = ''; }}
        placeholder="Np. Imbir jest dobry, ale nie na każdą okazję."
        maxlength={2000}
        rows={3}
        disabled={saving}
      />
      <div class="actions">
        <Button type="submit" size="sm" disabled={saving || value === saved}>
          {saving ? 'Zapisywanie…' : 'Zapisz komentarz'}
        </Button>
        <span class="counter">{value.length}/2000</span>
      </div>
      <p class:error={failed} class="status" role="status">{message}</p>
    </form>
  </details>
</div>

<style>
  .comment { margin-top: 10px; font-size: 12px; }
  .saved-comment { margin: 0 0 6px; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--ink); line-height: 1.6; }
  summary { width: fit-content; cursor: pointer; color: var(--green); font-weight: 600; }
  form { display: grid; gap: 8px; margin-top: 10px; }
  label { font-weight: 600; }
  .actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .counter, .status { color: var(--app-muted); }
  .status { margin: 0; }
  .error { color: #9f3340; }
</style>
