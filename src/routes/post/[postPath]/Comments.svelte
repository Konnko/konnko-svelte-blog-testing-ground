<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import Button from '$lib/components/Button.svelte'
	import Input from '$lib/components/Input.svelte'
	import { timeToLocale } from '$lib/util/timeToStr'

	export let comments: { username: string; created: string; text: string }[]
	export let postID: string
</script>

<p>Comments:</p>
{#each comments as comment}
	<div class="my-3 rounded-md border border-neutral-300 bg-white p-3">
		<div class="flex gap-4">
			<p class="bold">{comment.username}</p>
			<p class="text-neutral-600">{timeToLocale(comment.created)}</p>
		</div>
		<p>{comment.text}</p>
	</div>
{/each}
<form
	method="post"
	use:enhance={({ data }) => {
		data.append('post', postID)

		return async ({ result }) => {
			await invalidateAll()
			await applyAction(result)
		}
	}}
>
	<div class="flex gap-4">
		<Input name="text" />
		<Button type="submit">Send</Button>
	</div>
</form>
