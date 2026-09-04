<script lang="ts">
	import './layout.css';
	import '../styles.css';
	import '../accordion.css';
	import '../tier-list.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { ratingStore } from '$lib/ratings.svelte';

	let { data, children } = $props();
	function hydrateRatings() {
		ratingStore.hydrate(data.ratings, data.ratingsError);
	}
	hydrateRatings();
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
			<Tabs.List class="group-data-horizontal/tabs:h-10">
				<Tabs.Trigger value="/">Oceny</Tabs.Trigger>
				<Tabs.Trigger value="/tier-lista">Tier lista</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</nav>

	<Avatar.Group class="duo" aria-label="Filip i Emilia">
		<Avatar.Root size="sm"><Avatar.Fallback class="bg-blue-100 text-blue-800">F</Avatar.Fallback></Avatar.Root>
		<Avatar.Root size="sm"><Avatar.Fallback class="bg-pink-100 text-pink-800">E</Avatar.Fallback></Avatar.Root>
	</Avatar.Group>
</header>

{@render children()}

<footer>
	<span>Bolero Club</span>
	<span>78 smaków · 2 jurorów · 1 werdykt</span>
</footer>
