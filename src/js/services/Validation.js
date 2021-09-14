class Validation {
	MIN_REQUIRE_INPUT = 3;
	MIN_NUMBER_CARD = 3;

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

	checkAllowToEnd(questions = []) {
		if (questions.length < this.MIN_NUMBER_CARD) {
			swal({
				title: `You have just ${questions.length} card(s)`,
				text: 'We strongly recommend a minimum of 20 cards.',
				icon: 'warning',
				buttons: 'Continue',
			});
			return false;
		}
		return true;
	}

	checkFileType(file) {
		const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
		if (!validImageTypes.includes(file.type)) {
			swal('Please upload image only');
			return false;
		}

		return true;
	}

	isHttpURL(url = '') {
		// /^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g
		if (url.includes('data:image')) {
			return false;
		}
		return true;
	}
}

export default new Validation();
