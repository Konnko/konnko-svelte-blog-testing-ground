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
	class={`w-full rounded-lg border-2 border-gray-200 py-1 px-2 text-lg transition hover:outline-none ${
		$$props.class ?? ''
	} ${checkPattern ? 'invalid:border-red-400' : ''}`}
/>
