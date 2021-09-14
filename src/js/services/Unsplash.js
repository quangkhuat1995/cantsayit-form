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
			const data = results.map((item) => ({ rawUrl: item.urls.raw, description: item.description }));
			sessionStorage.setItem('UNSPLASH', JSON.stringify(data));
			return data;
		} catch (error) {
			throw new Error('image not found');
		}
	};
}

export default new Unsplash();
