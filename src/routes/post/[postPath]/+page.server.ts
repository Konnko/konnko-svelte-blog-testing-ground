import { pojofy } from '$lib/util/pojofy'
import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals, params }) => {
	const post = pojofy(
		await locals.pb
			.collection('posts')
			.getFirstListItem(`path="${params.postPath}"`, { expand: 'author' })
	)

	const comments = pojofy(
		await locals.pb
			.collection('comments')
			.getFullList(200, { filter: `post="${post.id}"`, expand: 'author' })
	)

	return { ...post, comments }
}) satisfies PageServerLoad

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData()

		const text = data.get('text')
		const post = data.get('post')

		await locals.pb.collection('comments').create({ text, author: locals.user.id, post })
	}
}
