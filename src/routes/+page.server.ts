import { pojofy } from '$lib/util/pojofy'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	try {
		const posts = await locals.pb
			.collection('posts')
			.getList(1, 20, { sort: '-created', expand: 'author' })
		return { posts: pojofy(posts) }
	} catch (e) {
		throw error(500, '500 Failed to fetch posts')
	}
}) satisfies PageServerLoad
