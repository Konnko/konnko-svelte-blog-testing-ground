import { S3_ACCESS_KEY, S3_SECRET, CF_ACCOUNT_ID } from '$env/static/private'
import { PrismaClient } from '@prisma/client'
import { S3Client } from '@aws-sdk/client-s3'

export const prisma = new PrismaClient()

export const bucket = new S3Client({
	region: 'auto',
	endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET
	}
})
