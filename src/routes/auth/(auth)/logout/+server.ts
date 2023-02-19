import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST = (async ({ locals }) => {
	locals.pb.authStore.clear()
	locals.user = null

	return json(null)
}) satisfies RequestHandler
