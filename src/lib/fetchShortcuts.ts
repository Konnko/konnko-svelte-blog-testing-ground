export const pfetch = (url: string, payload: unknown) =>
	fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	})
