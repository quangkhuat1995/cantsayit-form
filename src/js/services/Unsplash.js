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

	uploadPhotoImgur = async (file) => {
		try {
			const formData = new FormData();
			formData.append('image', file);
			const response = await fetch('https://api.imgur.com/3/upload', {
				method: 'POST',
				headers: {
					Authorization: 'Client-ID 09c3acf749605c5',
				},
				body: formData,
			});
			console.log(response);
			return response;
		} catch (error) {}
	};

	uploadPhoto = async (file) => {
		const key = '63e740333ad88f1ade6f4494a4d2b545';
		try {
			const formData = new FormData();
			formData.append('image', file);
			const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
				method: 'POST',
				body: formData,
			});
			const jsonResponse = await response.json();

			const { url, title } = jsonResponse.data;
			return { rawUrl: url, description: title, status: response.ok };
		} catch (error) {
			console.log(error);
		}
	};
}

export default new Unsplash();
