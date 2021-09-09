import { UNSPLASH_BASE_URL, UNSPLASH_ACCESS_KEY } from '../config/index.js';
class Unsplash {
	// https://unsplash.com/documentation#example-image-use
	searchPhotos = async (key = '') => {
		try {
			const response = await fetch(`${UNSPLASH_BASE_URL}/search/photos?page=1&query=${key}&orientation=landscape`, {
				method: 'GET',
				headers: {
					Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
					'Accept-Version': 'v1',
				},
			});

			const jsonResponse = await response.json();
			const { results } = jsonResponse;
			if (!results?.length) {
				throw new Error('No images found');
			}
			const rawUrl = results[0].urls.raw;
			const description = results[0].description;
			return { rawUrl, description };
		} catch (error) {
			console.log(error);
		}
	};
}

export default new Unsplash();
