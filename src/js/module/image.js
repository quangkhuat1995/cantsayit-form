import { loadingContent } from './index.js';

export const clearImage = () => {
	const mainImage = document.getElementById('mainImage');
	if (mainImage) {
		mainImage.setAttribute('src', '');
	}
};

export const showLoadingImage = () => {
	const mainImage = document.getElementById('mainImage');
	if (mainImage) {
		mainImage.classList.add('hide');
	}
	const wrapperLoading = document.createElement('DIV');
	wrapperLoading.className = 'h-full w-full flex justify-center items-center';
	wrapperLoading.innerHTML = loadingContent;

	mainImage.parentNode.insertBefore(wrapperLoading, mainImage);
};

export const showImage = (unsplashResult) => {
	const mainImageTag = document.getElementById('mainImage');
	mainImageTag.setAttribute('src', `${unsplashResult.value.rawUrl}&w=768&dpr=2`);
	mainImageTag.setAttribute('alt', unsplashResult.value.description);
	mainImageTag.classList.remove('hide');
	mainImageTag.parentNode.removeChild(mainImageTag.previousSibling);
	// TODO: investigate to remove loading screen
};