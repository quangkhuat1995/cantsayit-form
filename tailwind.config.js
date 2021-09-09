module.exports = {
	purge: {
		// enabled: true,
		// content: ['src/*.html'],
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				'daily-dev-tips': '#F89283',
				primary: 'rgb(246,111,77)',
				secondary: '#73D2F3', // light blue
				word: '#FFF4E0',
				light: '#E5E5E5',
				error: '#FF616D',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
