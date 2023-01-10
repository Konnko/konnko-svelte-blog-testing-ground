<script lang="ts">
	import { timeToLocale } from '$lib/util/timeToStr'
	import type { PageData } from './$types'
	import Comments from './Comments.svelte'

	export let data: PageData
</script>

<div class="rounded-lg bg-white p-6 shadow-md">
	<p>{@html data.text}</p>
	{timeToLocale(data.created)}
	{data.username}
	<Comments comments={data.comments} postID={data.id} />
</div>
