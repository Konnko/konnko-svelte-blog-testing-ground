export const timeToLocale = (timestr: Date) =>
	new Date(timestr).toLocaleString('en-GB', { timeZone: 'UTC' })
