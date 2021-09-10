import unsplashService from './services/Unsplash.js';
import dictionaryService from './services/Dictionary.js';
import { getExcludedWords } from './module/index.js';
import { clearSuggestionWords, populateSuggestionWords, showLoadingSuggestions } from './module/suggestions.js';
import { clearImage, showLoadingImage, showImage } from './module/image.js';

const ENTER_KEY_CODE = 13;
//each page will be section
const sectionTags = document.getElementsByTagName('section');
const [page1, page2, page3, ...rest] = sectionTags;

let excludedWords = [];
// only add .show for section doesn't use display block
const togglePage = (page) => {
	if (!page.classList.contains('flex')) {
		page.classList.add('show');
	}
	page.classList.remove('hide');
};

const renderPage1 = (e) => {
	togglePage(page1);
	page2.classList.add('hide');
	page3.classList.add('hide');
};

const renderPage2 = () => {
	togglePage(page2);
	page1.classList.add('hide');
	page3.classList.add('hide');
};

const renderPage3 = () => {
	togglePage(page3);
	page1.classList.add('hide');
	page2.classList.add('hide');

	clearSuggestionWords();
	clearImage();
};

// render page1 onLoaded complete
document.addEventListener('DOMContentLoaded', renderPage1);

// from page1 move to page 2
page1.querySelector('button').addEventListener('click', renderPage2);

// form page 2 move to page 3
page2.querySelector('input#title').addEventListener('keyup', (e) => {
	if (e.keyCode === ENTER_KEY_CODE || e.key === 'Enter') {
		renderPage3();
		// TODO: save the title: e.target.value
		getExcludedWords().then((text) => {
			excludedWords = text?.split('\n') || [];
			console.log(excludedWords);
		});
	}
});

page3.querySelector('form#search').addEventListener('submit', async (e) => {
	const searchValue = document.getElementById('searchWord').value;
	console.log(searchValue);
	e.preventDefault();

	showLoadingSuggestions();
	showLoadingImage();

	const [unsplashResult, dictionaryResult] = await Promise.allSettled([
		unsplashService.searchPhotos(searchValue),
		dictionaryService.searchWord(searchValue),
	]);

	if (unsplashResult.status === 'fulfilled') {
		// const mainImageTag = document.getElementById('mainImage');
		// mainImageTag.setAttribute('src', `${unsplashResult.value.rawUrl}&w=768&dpr=2`);
		// mainImageTag.setAttribute('alt', unsplashResult.value.description);
		showImage(unsplashResult);
	} else {
		//TODO: handle error not found image
	}

	if (dictionaryResult.status === 'fulfilled') {
		let { definition } = dictionaryResult.value;
		definition = definition.replace(/[^a-zA-Z0-9 ]/g, '');
		let suggestWords = definition.split(' ');

		console.log(suggestWords);
		suggestWords = suggestWords.filter((el) => !excludedWords.includes(el));
		console.log(suggestWords);
		populateSuggestionWords(suggestWords);
		// const mainImageTag = document.getElementById('mainImage');
		// mainImageTag.setAttribute('src', `${dictionaryResult.value.rawUrl}&w=768&dpr=2`);
		// mainImageTag.setAttribute('alt', dictionaryResult.value.description);
	} else {
		//TODO: handle error not found word
	}

	console.log('unsplashResult', unsplashResult);
	console.log('dictionaryResult', dictionaryResult);
	// unsplashService
	// 	.searchPhotos(searchValue)
	// 	.then((result) => {
	// 		// TODO: populate the
	// 		const mainImageTag = document.getElementById('mainImage');
	// 		mainImageTag.setAttribute('src', `${result.rawUrl}&w=768&dpr=2`);
	// 		mainImageTag.setAttribute('alt', result.description);
	// 	})
	// 	.catch((error) => console.log(error));

	// dictionaryService
	// 	.searchWord(searchValue)
	// 	.then((result) => {
	// 		console.log(result);
	// 	})
	// 	.catch((error) => console.log(error));
});
console.log('exx');

/**
 * onClick select suggest words
 */
const suggestionsDiv = document.getElementById('suggestions');
console.log(suggestionsDiv.childNodes);
// const selectWordBox = suggestionsDiv.querySelector(`div[data-id='suggestWord-${idx}']`);
// selectWordBox.addEventListener('click', () => {});
// selectWordBox.classList.add('word-selected');

const selectWord = (idx, word) => {
	const suggestionsDiv = document.getElementById('suggestions');
	const selectWordBox = suggestionsDiv.querySelector(`div[data-id='suggestWord-${idx}']`);
	selectWordBox.classList.add('word-selected');
};
