<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { pfetch } from '$lib/fetchShortcuts'
	import { PUBLIC_SK_URL } from '$env/static/public'
	import { user } from '$lib/store'

	const redirectURL = PUBLIC_SK_URL + 'auth/redirect'

	onMount(async () => {
		const params = new URL(window.location as any).searchParams
		if (params.get('state') === null) return
		const provider = JSON.parse(localStorage.getItem('provider')!)
		if (provider.state !== params.get('state')) {
			throw "State parameters don't match."
		}

		const payload = {
			name: provider.name,
			code: params.get('code')!,
			verifierCode: provider.codeVerifier,
			redirectURL
		}

		const userData = await (await pfetch('/auth/finishauth', payload)).json()

		user.set(userData)

		goto('/')
	})
</script>

<p>Loggining in</p>
