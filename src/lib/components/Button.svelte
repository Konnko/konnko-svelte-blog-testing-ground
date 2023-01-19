<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface $$Props extends HTMLButtonAttributes {}

	const buttonStyle =
		'rounded border-2 border-black bg-white px-2 py-1 transition disabled:border-neutral-400 disabled:bg-neutral-300 hover:cursor-pointer hover:bg-neutral-200'
</script>

<button {...$$props} class={`${buttonStyle} ` + $$props.class ?? ''}><slot /></button>
