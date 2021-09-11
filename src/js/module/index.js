import { clearSuggestionWords, populateSuggestionWords } from './suggestions.js';
import { clearImage, showImage } from './image.js';

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
	const inputs = document.querySelectorAll('#main input');
	inputs.forEach((inp) => (inp.value = ''));
};

export const populateEditData = (data, sid) => {
	const editData = data.find((item) => item.sid === sid);
	if (editData) {
		document.getElementById('searchWord').value = editData.word;
		populateSuggestionWords(editData.remainWords);
		showImage(editData.image);
		const inputs = document.querySelectorAll('#main input');
		inputs.forEach((inp, idx) => (inp.value = editData.prohibited_words?.[idx] || ''));
	} else {
		readyForNextCard();
	}
};
