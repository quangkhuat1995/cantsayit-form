export const getExcludedWords = () => {
	return fetch('../../const/excludedWords.txt')
		.then((response) => response.text())
		.then((text) => text)
		.catch((err) => console.log(err));
};

export const loadingContent = `
	<div class="load-wrapp">
		<div class="load-5">
			<div class="ring-2">
				<div class="ball-holder">
					<div class="ball"></div>
				</div>
			</div>
		</div>
	</div>
`;
