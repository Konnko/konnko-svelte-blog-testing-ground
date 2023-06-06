// src/hooks.server.js
import { SvelteKitAuth } from '@auth/sveltekit'
import { decode } from '@auth/core/jwt'
import Discord, { type DiscordProfile } from '@auth/core/providers/discord'
import { DISCORD_CLIENT_ID, DISCORD_SECRET, AUTH_SECRET } from '$env/static/private'
import { prisma } from '$lib/prisma'

/** @type {import('@sveltejs/kit').Handle} */
export const handle = (async ({ event, resolve }) => {
	const token = event.cookies.get('next-auth.session-token')

	if (token) {
		const decoded = await decode({ token, secret: AUTH_SECRET })
		event.locals.name = decoded?.sub
	}

	const authHandle = await SvelteKitAuth({
		providers: [
			//@ts-expect-error issue https://github.com/nextauthjs/next-auth/issues/6174
			Discord({
				clientId: DISCORD_CLIENT_ID,
				clientSecret: DISCORD_SECRET
			})
		],
		session: { strategy: 'jwt' },
		callbacks: {
			async signIn({ profile }) {
				if (!profile?.email) {
					return false
				}

				const typedProfile = profile as DiscordProfile
				const { username, image_url, email } = typedProfile
				const discordId = typedProfile.id

				const typecastedEmail = email as string

				try {
					if (discordId) {
						const result = await prisma.user.findUnique({
							where: {
								discordId
							}
						})

						if (result) {
							profile.sub = result.name
							return true
						}

						const newUserId = await prisma.user.create({
							data: {
								name: username,
								email: typecastedEmail,
								discordId,
								avatarUrl: image_url
							}
						})

						profile.sub = newUserId.name
					}
				} catch (error) {
					console.log(error)
					return false
				}

				return true
			},
			async jwt({ token, profile }) {
				if (profile) {
					token.sub = profile.sub
					token.picture = undefined
				}
				return token
			},
			async session({ session }) {
				if (session.user?.email) session.user.email = undefined
				return session
			}
		}
	})({ event, resolve })

	return authHandle
}) satisfies import('@sveltejs/kit').Handle
