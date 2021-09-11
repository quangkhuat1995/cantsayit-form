class Validation {
	MIN_REQUIRE_INPUT = 3;

	checkEmptyInput(inputElement) {
		if (typeof inputElement === 'string') {
			inputElement = document.getElementById(inputElement);
		}
		if (!inputElement.value.trim()) {
			inputElement.classList.add('bg-error');
			inputElement.classList.remove('bg-word');
			return false;
		}
		return true;
	}

	checkAmountOfInput(listInputElement) {
		const amountHasValue = Array.from(listInputElement).reduce(
			(total, inp) => (inp.value.trim() ? total + 1 : total),
			0
		);
		if (amountHasValue >= this.MIN_REQUIRE_INPUT) return true;
		const haEmptyInputAtIndex = Array.from(listInputElement).findIndex((inp) => !inp.value.trim());
		for (let i = haEmptyInputAtIndex; i < this.MIN_REQUIRE_INPUT; i++) {
			listInputElement[i].classList.add('bg-error');
			listInputElement[i].classList.remove('bg-word');
		}
		return false;
	}
}

export default new Validation();
