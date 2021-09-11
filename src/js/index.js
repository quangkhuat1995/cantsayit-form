import unsplashService from './services/Unsplash.js';
import dictionaryService from './services/Dictionary.js';
import validationService from './services/Validation.js';
import { getExcludedWords, readyForNextCard } from './module/index.js';
import { clearSuggestionWords, populateSuggestionWords, showLoadingSuggestions } from './module/suggestions.js';
import { clearImage, showLoadingImage, showImage } from './module/image.js';
import { clearCards, addNewCard } from './module/card.js';

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
	clearCards(uuidv4());
};

// render page1 onLoaded complete
document.addEventListener('DOMContentLoaded', renderPage1);

// from page1 move to page 2
page1.querySelector('button').addEventListener('click', renderPage2);

// form page 2 move to page 3
page2.querySelector('input#title').addEventListener('keyup', (e) => {
	if (e.keyCode === ENTER_KEY_CODE || e.key === 'Enter') {
		renderPage3();
		localStorage.setItem('title', e.target.value);
		getExcludedWords().then((text) => {
			excludedWords = text?.split('\n') || [];
			console.log(excludedWords);
		});
	}
});

page3.querySelector('form#search').addEventListener('submit', async (e) => {
	e.preventDefault();
	// const hasSearchValue = validationService.checkEmptyInput('searchWord');
	// if (!hasSearchValue) return;

	const searchValue = document.getElementById('searchWord').value.trim();
	if (!searchValue) return alert('please enter word');
	localStorage.setItem('word', searchValue);
	console.log(searchValue);

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
 * handle event click on each suggestion
 */
const suggestionsDiv = document.getElementById('suggestions');
suggestionsDiv.addEventListener('click', (e) => {
	console.log('click');
	const suggestBox = e.target.closest('div.relative.word-selected');
	const inputs = document.querySelectorAll('#main input');
	const haEmptyInputAtIndex = Array.from(inputs).findIndex((inp) => !inp.value.trim());
	console.log(suggestBox);
	if (suggestBox && haEmptyInputAtIndex !== -1) {
		if (suggestBox.dataset.show === 'true') {
			suggestBox.dataset.show = 'false';
			inputs[haEmptyInputAtIndex].value = suggestBox.dataset.id.split('-').pop();
			inputs[haEmptyInputAtIndex].classList.remove('bg-error');
			inputs[haEmptyInputAtIndex].classList.add('bg-word');
		}
	}
});

// console.log(suggestionsDiv.children);
// Array.from(suggestionsDiv.children).forEach((div) => div.addEventListener('click', selectWord));
// const selectWordBox = suggestionsDiv.querySelector(`div[data-id='suggestWord-${idx}']`);
// selectWordBox.addEventListener('click', () => {});
// selectWordBox.classList.add('word-selected');

/**
 * handle click add
 */

const btnAdd = document.getElementById('btnAdd');
btnAdd.addEventListener('click', (e) => {
	const inputs = document.querySelectorAll('#main input');
	let isValid = true;
	isValid &= validationService.checkAmountOfInput(inputs);
	if (isValid) {
		console.log('valid');
		const previousContainerDiv = document.getElementById('previous-container');
		const buttons = previousContainerDiv.querySelectorAll('button');
		const lastBtn = buttons[buttons.length - 1];

		// select current active card
		const cardBtn = previousContainerDiv.querySelector('button.bg-primary');
		if (!cardBtn) return;
		const currentSID = cardBtn.dataset.sid;

		// get old data
		let questions = JSON.parse(localStorage.getItem('question') || '[]') || [];

		const isAdd = !questions.length || questions?.findIndex((ques) => ques.sid === currentSID) === -1;
		debugger;
		const word = localStorage.getItem('word') || '';
		const prohibited_words = Array.from(inputs).reduce(
			(acc, inp) => (inp.value.trim() ? [...acc, inp.value.trim()] : acc),
			[]
		);
		const imageURL = document.getElementById('mainImage').getAttribute('src');

		if (isAdd) {
			questions.push({ sid: currentSID, type: 'word_explanation', word, prohibited_words, image: imageURL });
			const newSID = uuidv4();
			addNewCard(newSID, buttons.length + 1);
			// reset the form
			readyForNextCard();
		} else {
			questions = questions.map((item) => {
				if (item.sid === currentSID) {
					return { ...item, prohibited_words, imageURL, word };
				}
				return item;
			});
		}

		localStorage.setItem('question', JSON.stringify(questions));

		// TODO: save and move to next card
	} else {
		alert('please add at least 3 words');
	}
});
/**
 * handle click edit icon
 */
document
	.getElementById('previous-container')
	.querySelectorAll('button')
	.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const cardNumber = Number(e.target.dataset.card);
		});
	});
