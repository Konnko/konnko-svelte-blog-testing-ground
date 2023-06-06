export const pojofy = <T>(nonPOJO: T): T => JSON.parse(JSON.stringify(nonPOJO))
