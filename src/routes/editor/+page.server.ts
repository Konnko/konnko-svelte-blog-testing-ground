export const ssr = false

import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import { prisma } from '$lib/prisma'
import { pojofy } from '$lib/util/pojofy'

export const load = async ({ locals }) => {
	try {
		if (!locals.name) return redirect(308, '/')
		const name = locals.name

		const postDraft = await prisma.post.findFirst({
			where: {
				authorName: name,
				published: false
			},
			include: {
				images: {
					select: {
						url: true
					}
				}
			}
		})

		if (postDraft) return { post: pojofy(postDraft) }

		const newDraft = await prisma.post.create({
			data: {
				title: '',
				authorName: name
			}
		})

		return { post: pojofy({ ...newDraft, images: [] as { url: string }[] }) }
	} catch (e) {
		throw error(500, '500 Failed to fetch posts')
	}
}

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData())

		const name = locals.name

		if (!name || !data) {
			return fail(500, { serverError: true })
		}

		const { title, content, path, id } = data

		if (
			typeof title !== 'string' ||
			typeof content !== 'string' ||
			typeof path !== 'string' ||
			typeof id !== 'string'
		) {
			return fail(400, { badRequest: true })
		}

		try {
			await prisma.post.update({
				where: {
					id: Number(id)
				},
				data: {
					title: title,
					content: content,
					published: true,
					path: path
				}
			})
		} catch (e) {
			return fail(500, { serverError: true })
		}

		throw redirect(303, '/post/' + data.path)
	}
}
