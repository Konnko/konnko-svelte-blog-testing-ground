import { pojofy } from '$lib/util/pojofy'
import { error, type Actions } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'

export const load = async ({ params }) => {
	try {
		const post = await prisma.post.findUnique({
			where: {
				path: params.postPath
			},
			select: {
				id: true,
				title: true,
				content: true,
				authorName: true,
				createdAt: true,
				updatedAt: true,
				comments: true
			}
		})
		if (!post) throw error(404, '404 Post not found')
		return { post: pojofy(post) }
	} catch (e) {
		throw error(500, '500 Failed to fetch posts')
	}
}

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData()

		if (!locals.name || !data) {
			return error(500, "Couldn't post comment")
		}

		const text = data.get('text')
		const post = data.get('post')

		await prisma.comment.create({
			data: {
				content: text as string,
				authorName: locals.name,
				postId: Number(post)
			}
		})

		return { success: true }
	}
}
