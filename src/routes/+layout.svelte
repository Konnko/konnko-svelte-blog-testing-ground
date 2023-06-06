<script lang="ts">
	import '../app.css'
	import { page } from '$app/stores'
	import Button from '$lib/components/Button.svelte'

	const outerWrap = 'w-screen content-center break-words'
	const contentWrap = 'm-auto max-w-4xl'
</script>

<nav class="{outerWrap} mb-4 bg-white p-1.5 drop-shadow">
	<div class="{contentWrap} flex items-center justify-between align-middle">
		<a href="/" class="cursor-pointer rounded-md bg-black p-2 text-2xl text-white">BLOG</a>
		{#if $page.data.session}
			<div class="flex items-center gap-6">
				<Button><a href="/editor" class="text-lg">+ Post</a></Button>
				<a href="/auth/signout" class="text-lg"> Sign out </a>
			</div>
		{:else}
			<a href="/auth/signin" class="text-lg"> Log in </a>
		{/if}
	</div>
</nav>

<div class="{outerWrap} h-full">
	<div class={contentWrap}>
		<slot />
	</div>
</div>
