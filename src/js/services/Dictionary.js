import { DICTIONARY_BASE_URL } from '../config/index.js';

class Dictionary {
	searchWord = async (word = '') => {
		try {
			const response = await fetch(`${DICTIONARY_BASE_URL}/${word.toLowerCase()}`);
			const jsonResponse = await response.json();
			if (response.ok) {
				const { definition, example } = jsonResponse[0].meanings[0].definitions[0];
				return { definition, example };
			}

			// TODO: handle wrong word search here
			// jsonResponse = {
			//		message: "Sorry pal, we couldn't find definitions for the word you were looking for."
			//		resolution: "You can try the search again at later time or head to the web instead."
			//		title: "No Definitions Found"
			//	}
			return { definition: 'Not found' };
		} catch (error) {
			console.log(error);
		}
	};
}

export default new Dictionary();
