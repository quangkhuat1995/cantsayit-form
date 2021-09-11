import { loadingContent } from './index.js';

export const clearImage = () => {
	const mainImage = document.getElementById('mainImage');
	if (mainImage) {
		mainImage.setAttribute('src', '');
		mainImage.setAttribute('alt', '');
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
	mainImageTag.setAttribute('src', `${unsplashResult.rawUrl}&w=768&dpr=2`);
	mainImageTag.setAttribute('alt', unsplashResult.description);
	mainImageTag.classList.remove('hide');
	mainImageTag.previousSibling.remove();
	// mainImageTag.parentNode.removeChild(mainImageTag.previousSibling);
};
