import unsplashService from './services/Unsplash.js';

const ENTER_KEY_CODE = 13;
//each page will be section
const sectionTags = document.getElementsByTagName('section');
const [page1, page2, page3, ...rest] = sectionTags;

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
	}
});

const formSearchElement = page3.querySelector('form#search');
// console.log(formSearchElement);
// if (searchValue.trim() === '') {
// 	formSearchElement.querySelector('button').setAttribute('disabled', 'true');
// } else {
// 	formSearchElement.querySelector('button').removeAttribute('disabled');
// }
console.log('ex');
page3.querySelector('form#search').addEventListener('submit', (e) => {
	const searchValue = document.getElementById('searchWord').value;
	console.log(searchValue);
	e.preventDefault();
	unsplashService
		.searchPhotos(searchValue)
		.then((result) => {
			// TODO: populate the
			const mainImageTag = document.getElementById('mainImage');
			mainImageTag.setAttribute('src', `${result.rawUrl}&w=768&dpr=2`);
			mainImageTag.setAttribute('alt', result.description);
		})
		.catch((error) => console.log(error));
});
console.log('exx');
