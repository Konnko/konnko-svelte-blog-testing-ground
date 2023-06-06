import { json, type RequestHandler } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'

export const POST = (async ({ request }) => {
	const wantedPath = (await request.json())?.path

	const result = await prisma.post.findUnique({
		where: {
			path: wantedPath
		}
	})

	if (result) return json({ pathAvailable: false })

	return json({ pathAvailable: true })
}) satisfies RequestHandler
