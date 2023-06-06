import type { ServerLoad } from '@sveltejs/kit'

export const load = (async ({ locals }) => {
	return { session: await locals.getSession() }
}) satisfies ServerLoad
