import { PUBLIC_PB_URL } from '$env/static/public'

export interface ImgData {
	collectionId: string
	id: string
	file: string
}

export const generateImgLink = (imgData: ImgData) => {
	const { collectionId, id, file } = imgData

	return `${PUBLIC_PB_URL}api/files/${collectionId}/${id}/${file}`
}
