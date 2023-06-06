import { error, json, redirect, type RequestHandler } from '@sveltejs/kit'
import { bucket, prisma } from '$lib/prisma'
import { v4 } from 'uuid'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

// hacky way to convert a stream to a buffer (for S3)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function streamToBuffer(stream: any): Promise<Buffer> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const chunks: any[] = []

	for await (const chunk of stream) {
		chunks.push(chunk)
	}

	return Buffer.concat(chunks)
}

export const POST = (async ({ request, locals }) => {
	const imgFormData = await request.formData()

	const image = imgFormData.get('image') as File
	const postId = Number(imgFormData.get('postId'))

	if (!locals.name) redirect(308, '/')

	try {
		const postImagesCount = await prisma.image.count({
			where: {
				postId: postId
			}
		})

		if (postImagesCount >= 9) throw error(400, { message: 'Too many images' })

		const key = `${v4()}-${image.name}`

		const buffer = await streamToBuffer(image.stream())

		await bucket.send(
			new PutObjectCommand({
				Bucket: 'testing-ground',
				Key: key,
				Body: buffer
			})
		)

		const result = await prisma.image.create({
			data: {
				url: key,
				postId: postId
			}
		})
		return json({ url: result.url })
	} catch (e) {
		throw error(500, { message: 'Image upload failed' })
	}
}) satisfies RequestHandler

export const DELETE = (async ({ request, locals }) => {
	const imgUrl = (await request.json()) as unknown as {
		url: string
	}

	if (!locals.name) redirect(308, '/')

	try {
		const imagePostAuthor = await prisma.image.findUnique({
			where: {
				url: imgUrl.url
			},
			select: {
				post: {
					select: {
						authorName: true
					}
				}
			}
		})

		if (!imagePostAuthor?.post) throw error(404, { message: 'Image not found' })
		if (imagePostAuthor.post.authorName !== locals.name) throw error(403, { message: 'Forbidden' })

		await bucket.send(new DeleteObjectCommand({ Bucket: 'testing-ground', Key: imgUrl.url }))

		await prisma.image.delete({
			where: {
				url: imgUrl.url
			}
		})

		return json({ success: true })
	} catch (e) {
		throw error(500, { message: 'Image upload failed' })
	}
}) satisfies RequestHandler
