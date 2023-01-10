<script lang="ts">
	import '../app.css'
	import { user } from '$lib/store'
	import Button from '$lib/components/Button.svelte'

	export let data

	data && user.set(data)
</script>

<nav class="outer-wrap nav">
	<div class="content-wrap nav__content">
		<a href="/" class="nav__logo">BLOG</a>
		{#if $user?.username}
			<div class="nav__buttons">
				<Button><a href="/createpost" class="text-lg">+ Post</a></Button>
				<p class="text-lg">{$user.username}</p>
			</div>
		{:else}
			<a href="/auth/signin" class="text-lg"> Log in </a>
		{/if}
	</div>
</nav>

<div class="outer-wrap h-full">
	<div class="content-wrap">
		<slot />
	</div>
</div>

<style>
	.outer-wrap,
	nav {
		@apply w-screen content-center break-words;
	}

	.content-wrap {
		@apply m-auto max-w-4xl;
	}

	.nav {
		@apply mb-4 bg-white p-1.5 drop-shadow;
	}

	.nav__content {
		@apply flex items-center justify-between align-middle;
	}

	.nav__logo {
		@apply cursor-pointer rounded-md bg-black p-2 text-2xl text-white;
	}

	.nav__buttons {
		@apply flex items-center gap-6;
	}

	.nav__post-button:hover {
		@apply bg-neutral-100;
	}
</style>
