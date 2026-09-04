<script lang="ts">
	import './layout.css';
	import '../styles.css';
	import '../accordion.css';
	import '../tier-list.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { children } = $props();
	let activeTab = $derived(page.url.pathname.startsWith('/tier-lista') ? '/tier-lista' : '/');

	function changeTab(value: string) {
		if (value !== page.url.pathname) void goto(value);
	}
</script>

<svelte:head>
	<title>Bolero Club</title>

	<meta
		name="description"
		content="Prywatny ranking smaków Bolero Filipa i Emilii"
	/>
</svelte:head>

<header class="topbar">
	<a
		class="brand"
		href="/"
		aria-label="Bolero Club — strona główna"
	>
		<span class="brand-mark">B</span>
		<span>Bolero <em>Club</em></span>
	</a>

	<nav aria-label="Główna nawigacja">
		<Tabs.Root value={activeTab} onValueChange={changeTab}>
			<Tabs.List>
				<Tabs.Trigger value="/">Oceny</Tabs.Trigger>
				<Tabs.Trigger value="/tier-lista">Tier lista</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</nav>

	<div class="duo" aria-label="Filip i Emilia"><span>F</span><span>E</span></div>
</header>

{@render children()}

<footer>
	<span>Bolero Club</span>
	<span>78 smaków · 2 jurorów · 1 werdykt</span>
</footer>
