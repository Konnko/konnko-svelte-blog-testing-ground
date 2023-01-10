<script lang="ts">
	import { timeToLocale } from '$lib/util/timeToStr'
	import type { PageData } from './$types'

	export let data: PageData
</script>

{#each data.posts.items as post}
	<div class="my-5 w-full rounded-lg border bg-white px-9 py-6 shadow-md">
		<a href={'/post/' + post.path}>{post.title}</a>
		<div class="flex justify-end gap-5">
			<p class=" overflow-auto">{post.expand.author.username}</p>
			<p>{timeToLocale(post.created)}</p>
		</div>
	</div>
{/each}
