import { error, json } from '@sveltejs/kit'
import type { ClientResponseError } from 'pocketbase'
import type { RequestHandler } from './$types'

export const POST = (async ({ request, locals }) => {
	const { path } = await request.json()

	try {
		await locals.pb.collection('posts').getFirstListItem(`path="${path}"`)
	} catch (e) {
		const err = e as ClientResponseError

		if (err.status === 404) return json({ pathAvailable: true })
		throw error(500, { message: 'PB error' })
	}

	return json({ pathAvailable: false })
}) satisfies RequestHandler
