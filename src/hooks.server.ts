// src/hooks.server.js
import type { Handle } from '@sveltejs/kit'
import { PUBLIC_PB_URL } from '$env/static/public'
import PocketBase from 'pocketbase'
import { pojofy } from '$lib/util/pojofy'

/** @type {import('@sveltejs/kit').Handle} */
export const handle = (async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PUBLIC_PB_URL)

	// load the store data from the request cookie string
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh()
			event.locals.user = pojofy(event.locals.pb.authStore.model)
		}
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear()
		event.locals.user = null
	}

	const response = await resolve(event)

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie())
	response.headers.set('Access-Control-Allow-Origin', PUBLIC_PB_URL)

	return response
}) satisfies Handle
