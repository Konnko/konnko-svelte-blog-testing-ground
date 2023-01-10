import type { ServerLoad } from '@sveltejs/kit'

export const load = (({ locals }) => {
	return locals.user
}) satisfies ServerLoad
