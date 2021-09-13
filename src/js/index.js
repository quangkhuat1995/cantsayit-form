import unsplashService from './services/Unsplash.js';
import dictionaryService from './services/Dictionary.js';
import validationService from './services/Validation.js';
import uploadService from './services/Upload.js';
import { getExcludedWords, modifyQuestions, populateEditData, readyForNextCard } from './module/index.js';
import { clearSuggestionWords, populateSuggestionWords, showLoadingSuggestions } from './module/suggestions.js';
import { clearImage, showLoadingImage, showImage } from './module/image.js';
import { clearCards, addNewCard, activeLastCard } from './module/card.js';
import { clearInputs, populateSingleInput } from './module/inputs.js';

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

	const searchValue = document.getElementById('searchWord').value.trim();
	if (!searchValue) return alert('please enter word');
	localStorage.setItem('word', searchValue);

	showLoadingSuggestions();
	showLoadingImage();
	clearInputs();

	const [unsplashResult, dictionaryResult] = await Promise.allSettled([
		unsplashService.searchPhotos(searchValue),
		dictionaryService.searchWord(searchValue),
	]);

	if (unsplashResult.status === 'fulfilled') {
		showImage(unsplashResult.value);
	} else {
		//TODO: handle error not found image
	}

	if (dictionaryResult.status === 'fulfilled') {
		let { definition } = dictionaryResult.value;
		definition = definition.replace(/[^a-zA-Z0-9 ]/g, '');
		let suggestWords = definition.split(' ');

		suggestWords = suggestWords.filter((el) => !excludedWords.includes(el));
		populateSuggestionWords(suggestWords);
	} else {
		//TODO: handle error not found word
	}
});

/**
 * handle event click on each suggestion
 */
const suggestionsDiv = document.getElementById('suggestions');
suggestionsDiv.addEventListener('click', (e) => {
	const suggestBox = e.target.closest('div.relative.word-selected');
	const inputs = document.querySelectorAll('#main input');
	const hasEmptyInputAtIndex = Array.from(inputs).findIndex((inp) => !inp.value.trim());
	if (suggestBox && hasEmptyInputAtIndex !== -1) {
		if (suggestBox.dataset.show === 'true') {
			suggestBox.dataset.show = 'false';
			const value = suggestBox.dataset.id.split('-').pop();
			populateSingleInput(inputs[hasEmptyInputAtIndex], value);
		}
	}
});

/**
 * handle click add
 */

const btnAdd = document.getElementById('btnAdd');
btnAdd.addEventListener('click', (e) => {
	const inputs = document.querySelectorAll('#main input');
	let isValid = true;
	isValid &= validationService.checkAmountOfInput(inputs);
	if (isValid) {
		const previousContainerDiv = document.getElementById('previous-container');
		const buttons = previousContainerDiv.querySelectorAll('button');

		// select current active card
		const cardBtn = previousContainerDiv.querySelector('button.bg-primary');
		if (!cardBtn) return;
		const currentSID = cardBtn.dataset.sid;

		// get old data
		let questions = JSON.parse(localStorage.getItem('question') || '[]') || [];

		const isAdd = !questions.length || questions?.findIndex((ques) => ques.sid === currentSID) === -1;
		const word = localStorage.getItem('word') || '';
		const prohibited_words = Array.from(inputs).reduce(
			(acc, inp) => (inp.value.trim() ? [...acc, inp.value.trim()] : acc),
			[]
		);
		const imageURL = document.getElementById('mainImage').getAttribute('src');
		const imageAlt = document.getElementById('mainImage').getAttribute('alt');
		const remainWordBoxes = document
			.getElementById('suggestions')
			.querySelectorAll('div.relative.word-selected[data-show="true"]');
		let remainWords = [];
		if (remainWordBoxes) {
			remainWords = Array.from(remainWordBoxes).map((item) => item.dataset.id.split('-').pop());
		}

		if (isAdd) {
			questions.push({
				sid: currentSID,
				type: 'word_explanation',
				word,
				prohibited_words,
				image: { rawUrl: imageURL, description: imageAlt },
				remainWords,
			});
			const newSID = uuidv4();
			addNewCard(newSID, buttons.length + 1);
		} else {
			questions = questions.map((item) => {
				if (item.sid === currentSID) {
					return {
						...item,
						word,
						prohibited_words,
						image: { rawUrl: imageURL, description: imageAlt },
						remainWords,
					};
				}
				return item;
			});
			activeLastCard(buttons);
		}

		localStorage.setItem('question', JSON.stringify(questions));
		readyForNextCard();
	} else {
		return alert('please add at least 3 words');
	}
});

/**
 * handle click edit icon
 */
page3.querySelector('#previous-container').addEventListener('click', (e) => {
	if (!e.target.dataset.sid) return;
	// do nothing if click on the same active one
	if (e.target.classList.contains('bg-primary')) return;
	// update the card UI
	toggleActiveSelectedCard(e.target);

	const questions = JSON.parse(localStorage.getItem('question') || '[]') || [];
	populateEditData(questions, e.target.dataset.sid);
});

const btnEnd = document.getElementById('btnEnd');
btnEnd.addEventListener('click', () => {
	const questions = JSON.parse(localStorage.getItem('question') || '[]') || [];
	const canEnd = validationService.checkAllowToEnd(questions);
	if (canEnd) {
		const title = localStorage.getItem('title') || '';
		const data = {
			sid: uuidv4(),
			title,
			slug: String(title).trim()?.replace(/\s/g, '-') || '',
			cover: 'empty',
			author_id: 'system',
			questions: modifyQuestions(questions),
		};
		uploadService
			.save(data)
			.then((res) => {
				console.log('done');
				localStorage.clear();

				swal({
					title: `Thank you`,
					text: 'You have successful uploaded',
					icon: 'success',
					buttons: ['Cancel', 'Do another'],
				}).then((ok) => {
					if (ok) {
						renderPage1();
					} else {
						// do nothing
					}
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
});
