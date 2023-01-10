export const ssr = false

import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const pb = locals.pb
		const data = Object.fromEntries(await request.formData())

		if (data.text.length < 20) return fail(400, { postTooShort: true })

		try {
			await pb.collection('posts').create({ ...data, author: locals.user.id })
		} catch (e) {
			return fail(500, { serverError: true })
		}

		throw redirect(303, '/post/' + data.path)
	}
}
