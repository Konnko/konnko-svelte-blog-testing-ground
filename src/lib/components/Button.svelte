<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface $$Props extends HTMLButtonAttributes {}
</script>

<button {...$$props} class={'buttonStyle ' + $$props.class ?? ''}><slot /></button>

<style>
	.buttonStyle {
		@apply rounded border-2 border-black bg-white px-2 py-1 transition;
	}

	.buttonStyle:hover {
		@apply cursor-pointer bg-neutral-200;
	}

	.buttonStyle:disabled {
		@apply border-neutral-400 bg-neutral-300;
	}
</style>
