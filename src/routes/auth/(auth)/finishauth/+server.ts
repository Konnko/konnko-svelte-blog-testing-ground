import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST = (async ({ request, locals }) => {
	const { name, code, verifierCode, redirectURL } = await request.json()
	const authData = await locals.pb
		.collection('users')
		.authWithOAuth2(name, code, verifierCode, redirectURL)

	return json(authData.record)
}) satisfies RequestHandler
