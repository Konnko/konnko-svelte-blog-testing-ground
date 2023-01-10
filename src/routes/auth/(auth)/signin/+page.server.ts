import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	const authMethods = await locals.pb.collection('users').listAuthMethods()

	return { authMethods: structuredClone(authMethods) }
}) satisfies PageServerLoad
