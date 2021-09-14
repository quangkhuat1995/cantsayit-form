import { clearSuggestionWords, populateSuggestionWords } from './suggestions.js';
import { clearImage, showImage } from './image.js';
import { clearInputs, populateInputs } from './inputs.js';

export const getExcludedWords = () => {
	return fetch('../../const/excludedWords.txt')
		.then((response) => response.text())
		.then((text) => text)
		.catch((err) => console.log(err));
};

export const loadingContent = `
	<div class="load-wrapp">
		<div class="load-5">
			<div class="ring-2">
				<div class="ball-holder">
					<div class="ball"></div>
				</div>
			</div>
		</div>
	</div>
`;

export const readyForNextCard = () => {
	document.getElementById('searchWord').value = '';
	clearSuggestionWords();
	clearImage();
	clearInputs();
};

export const populateEditData = (data, sid) => {
	const editData = data.find((item) => item.sid === sid);
	if (editData) {
		document.getElementById('searchWord').value = editData.word;
		populateSuggestionWords(editData.remainWords);
		showImage(editData.image);
		populateInputs(editData.prohibited_words);
	} else {
		readyForNextCard();
	}
};

export const modifyQuestions = (questions = []) => {
	return questions.map((item) => {
		const { image, remainWords, ...rest } = item;
		return {
			...rest,
			image: image.rawUrl,
		};
	});
};
