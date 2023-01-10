import type { BaseAuthStore } from 'pocketbase'
import { writable, type Writable } from 'svelte/store'

export const user: Writable<BaseAuthStore['baseModel']> = writable()
