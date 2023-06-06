import { pojofy } from '$lib/util/pojofy'
import { prisma } from '$lib/prisma'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load = (async () => {
	try {
		const result = await prisma.post.findMany({
			where: {
				published: true
			},
			orderBy: {
				createdAt: 'desc'
			},
			skip: 0,
			take: 50
		})

		return { posts: pojofy(result) }
	} catch {
		throw error(500, '500 Failed to fetch posts')
	}
}) satisfies PageServerLoad
