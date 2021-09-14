// should fire when click search

export const populateSingleInput = (inputElement, value) => {
	inputElement.value = value;
	inputElement.classList.remove('bg-error');
	inputElement.classList.add('bg-word');
};

export const populateInputs = (values = []) => {
	const inputs = document.querySelectorAll('#main input[type="text"]');
	inputs.forEach((inp, index) => (inp.value = values[index] || ''));
};

export const clearInputs = () => {
	populateInputs();
};
