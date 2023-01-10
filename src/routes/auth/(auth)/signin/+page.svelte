<script lang="ts">
	export let data: any

	import { PUBLIC_SK_URL } from '$env/static/public'
	import type { AuthProviderInfo } from 'pocketbase'

	let authMethods = data.authMethods

	const redirectURL = PUBLIC_SK_URL + 'auth/redirect'

	async function login(provider: AuthProviderInfo) {
		localStorage.setItem('provider', JSON.stringify(provider))
		window.location.href = provider.authUrl + redirectURL
	}
</script>

{#await authMethods then res}
	<button on:click={() => login(res.authProviders[0])}
		>Login with {res.authProviders[0].name}</button
	>
{/await}
