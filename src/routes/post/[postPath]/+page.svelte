<script lang="ts">
	import { timeToLocale } from '$lib/util/timeToStr'
	import Comments from './Comments.svelte'

	export let data

	const { title, authorName, createdAt, comments, id, content } = data.post
</script>

<div class="rounded-lg bg-white p-6 shadow-md">
	{#if title}
		<h2 class=" font-semibold text-xl">{title}</h2>
	{/if}
	{timeToLocale(createdAt)}
	{authorName}
	{@html content}
	<Comments {comments} postId={id} />
</div>
