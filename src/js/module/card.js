export const clearCards = (uuid) => {
	const previousContainerDiv = document.getElementById('previous-container');
	previousContainerDiv.innerHTML = `
		<button data-sid="${uuid}" style="min-width: 2rem;" class="w-8 h-8 rounded-full bg-primary text-center text-xl shadow-round">1</button>
	`;
};

export const addNewCard = (uuid, num) => {
	const previousContainerDiv = document.getElementById('previous-container');
	const newCard = document.createElement('button');
	newCard.className = 'w-8 h-8 rounded-full bg-primary text-center text-xl shadow-round';
	newCard.dataset.sid = uuid;
	newCard.style.minWidth = '2rem';
	newCard.innerHTML = num;

	previousContainerDiv.append(newCard);
	// the previous siblings should be removed the 'active' class eg: bg-primary
	if (num !== 1) {
		newCard.previousElementSibling.classList.remove('bg-primary');
		newCard.previousElementSibling.classList.add('bg-secondary');
	}
};
