import { generateImgLink, type ImgData } from '$lib/util/generateImgLink'
import { error, json } from '@sveltejs/kit'
import type { ClientResponseError } from 'pocketbase'
import type { RequestHandler } from './$types'

export const POST = (async ({ request, locals }) => {
	const imgFormData = await request.formData()

	let result: ImgData

	imgFormData.append('uploader', locals.user.id)

	try {
		result = await locals.pb.collection('images').create(imgFormData)
	} catch (e) {
		const err = e as ClientResponseError

		if (err.status === 404) return json({ pathAvailable: true })
		throw error(500, { message: 'PB error' })
	}

	return json({ location: generateImgLink(result) })
}) satisfies RequestHandler
