<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	export let checkPattern = false

	interface $$props extends HTMLInputAttributes {
		type?: 'text' | 'number' | 'tel' | 'email' | 'url' | 'search'
	}
</script>

<input
	on:focusout
	on:keyup
	{...$$props}
	class={`inputStyle ${$$props.class ?? ''} ${checkPattern ? 'inputStyleInvalid' : ''}`}
/>

<style>
	.inputStyle {
		@apply w-full rounded-lg border-2 border-gray-200 py-1 px-2 text-lg transition;
	}

	.inputStyle:hover {
		@apply outline-none;
	}

	.inputStyleInvalid:invalid {
		@apply border-red-400;
	}
</style>
