<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import Button from '$lib/components/Button.svelte'
	import Input from '$lib/components/Input.svelte'
	import { timeToLocale } from '$lib/util/timeToStr'
	import type { Comment } from '@prisma/client'

	export let comments: Comment[]
	export let postId: number
</script>

<p>Comments:</p>
{#each comments as { authorName, createdAt, content }}
	<div class="my-3 rounded-md border border-neutral-300 bg-white p-3">
		<div class="flex gap-4">
			<p class="bold">{authorName}</p>
			<p class="text-neutral-600">{timeToLocale(createdAt)}</p>
		</div>
		<p>{content}</p>
	</div>
{/each}
<form
	method="post"
	use:enhance={({ data }) => {
		data.append('post', String(postId))

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
