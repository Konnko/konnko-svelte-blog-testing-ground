export const timeToLocale = (timestr: string) =>
	new Date(timestr).toLocaleString('en-GB', { timeZone: 'UTC' })
