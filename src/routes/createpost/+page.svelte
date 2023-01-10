<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import Button from '$lib/components/Button.svelte'
	import Input from '$lib/components/Input.svelte'
	import { pfetch } from '$lib/fetchShortcuts'
	import { onMount } from 'svelte'
	import type { ActionData } from './$types'

	export let form: ActionData

	let titleWasInFocus = false
	let pathWasInFocus = false

	let text: string

	let timer: number
	let isPathAvailable = true
	const debouncePathCheck = (e: KeyboardEvent) => {
		clearTimeout(timer)
		const { value } = e.target as HTMLInputElement

		timer = window.setTimeout(async () => {
			const res = await pfetch(window.location.pathname + '/checkPath', { path: value })
			const data = await res.json()
			isPathAvailable = data.pathAvailable
		}, 750)
	}

	let hadMounted = false
	onMount(() => {
		const draft = localStorage.getItem('postDraft')
		text = draft ?? ''
		hadMounted = true
	})

	$: hadMounted && localStorage.setItem('postDraft', text)
</script>

<form
	method="POST"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll()
				localStorage.removeItem('postDraft')
			}
			await applyAction(result)
		}
	}}
>
	<div class="my-2">
		<label for="title" class=" ml-1 text-gray-500">Title</label>
		<Input
			type="text"
			name="title"
			placeholder="Your title"
			pattern={String.raw`.{3,50}`}
			checkPattern={titleWasInFocus}
			required
			on:focusout={() => (titleWasInFocus = true)}
		/>
		<p class="ml-1 text-xs text-gray-500">Title has to be 3 to 50 symbols long</p>
	</div>

	<div class="my-4">
		{#await import('./Editor.svelte') then Editor}
			<Editor.default bind:text />
		{/await}
		<input type="text" name="text" bind:value={text} hidden />
		{#if form?.postTooShort && text.length < 20}<p class="ml-1 text-xs text-red-600">
				Post is too short
			</p>{/if}
	</div>

	<div class="my-2">
		<label for="path" class="ml-1 text-gray-500">Path to the article</label>
		<Input
			type="text"
			name="path"
			placeholder=""
			pattern={String.raw`[-a-zA-Z0-9]{3,30}`}
			checkPattern={pathWasInFocus}
			required
			on:focusout={() => (pathWasInFocus = true)}
			on:keyup={debouncePathCheck}
		/>
		<div class="flex justify-between">
			<p class="ml-1 text-xs text-gray-500">
				Path should contain only -, english letters, decimals and its length should be between 3 and
				30 symbols
			</p>
			{#if !isPathAvailable}
				<p class="mr-2 text-xs text-red-500">Path is taken</p>
			{/if}
		</div>
	</div>

	<div class="mx-auto w-1">
		<Button type="submit">Publish</Button>
	</div>
	{#if form?.serverError}<p class="ml-1 text-xs text-red-600">Something went wrong</p>{/if}
</form>
