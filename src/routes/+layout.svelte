<script lang="ts">
  import '../styles.css';
  import '../accordion.css';
  import '../tier-list.css';
  import { page } from '$app/state';
  let { children } = $props();
</script>

<svelte:head><title>Bolero Club</title><meta name="description" content="Prywatny ranking smaków Bolero Filipa i Emilii" /></svelte:head>

<header class="topbar">
  <a class="brand" href="/" aria-label="Bolero Club — strona główna"><span class="brand-mark">B</span><span>Bolero <em>Club</em></span></a>
  <nav aria-label="Główna nawigacja">
    <a href="/" class:active={page.url.pathname === '/'}>Oceny</a>
    <a href="/tier-lista" class:active={page.url.pathname.startsWith('/tier-lista')}>Tier lista</a>
  </nav>
  <div class="duo" aria-label="Filip i Emilia"><span>F</span><span>E</span></div>
</header>

{@render children()}

<footer><span>Bolero Club</span><span>78 smaków · 2 jurorów · 1 werdykt</span></footer>
