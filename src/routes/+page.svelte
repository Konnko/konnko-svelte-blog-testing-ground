<script lang="ts">
	import { PUBLIC_R2_URL } from '$env/static/public'
	import { timeToLocale } from '$lib/util/timeToStr'

	export let data
</script>

{#each data.posts as post}
	<div class="my-5 w-full rounded-lg border bg-white shadow-md overflow-hidden">
		{#if post.cover}
			<img class=" w-48 h-100%" src={PUBLIC_R2_URL + post.cover} alt="Post cover" />
		{/if}
		<div class="px-6 py-4">
			<a href={'/post/' + post.path}>{post.title}</a>
			<div class="flex justify-end gap-5">
				<p class=" overflow-auto">{post.authorName}</p>
				<p>{timeToLocale(post.createdAt)}</p>
			</div>
		</div>
	</div>
{/each}
