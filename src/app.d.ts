// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type pocketbase, { BaseAuthStore } from 'pocketbase'

declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			pb: pocketbase
			user: BaseAuthStore.model
		}
		// interface PageData {}
		// interface Platform {}
	}
}
