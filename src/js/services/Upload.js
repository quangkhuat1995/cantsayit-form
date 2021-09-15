import { MONGO_URL } from '../config/index.js';
class Upload {
	async save(data) {
		try {
			const data_1 = await fetch(MONGO_URL, {
				method: 'POST',
				body: JSON.stringify(data),
			});
			return data_1;
		} catch (err) {
			console.log(err);
		}
	}
}

export default new Upload();
