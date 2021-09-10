import { loadingContent } from './index.js';

export const populateSuggestionWords = (suggestionWords = []) => {
	const suggestionsDiv = document.getElementById('suggestions');
	let body = '';
	suggestionWords.map((word, idx) => {
		body += `
			<div data-id="suggestWord-${idx + 1}-${word}" class="bg-word text-gray-600 leading-7 h-7 w-max px-2 relative">
				<span>${word}</span>
				<span class="absolute top-0 right-0 border-black border rounded-full w-4 h-4 bg-word flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 text-center">+</span>
			</div>
		`;
	});
	suggestionsDiv.innerHTML = body;
};

export const clearSuggestionWords = () => {
	const suggestionsDiv = document.getElementById('suggestions');
	if (suggestionsDiv) {
		suggestionsDiv.innerHTML = '';
	}
};

/**
 * TODO: add loading when calling API
 */
export const showLoadingSuggestions = () => {
	const suggestionsDiv = document.getElementById('suggestions');
	if (suggestionsDiv) {
		suggestionsDiv.innerHTML = loadingContent;
	}
};

export const selectWord = (idx, word) => {
	const suggestionsDiv = document.getElementById('suggestions');
	const selectWordBox = suggestionsDiv.querySelector(`div[data-id='suggestWord-${idx}']`);
	selectWordBox.classList.add('word-selected');
};
