export const pfetch = (url: string, payload?: unknown | FormData) =>
	fetch(url, {
		method: 'POST',
		body: payload instanceof FormData ? payload : JSON.stringify(payload)
	})
