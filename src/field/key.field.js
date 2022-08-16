module.exports = {
	label: "Clé",
	title: "Clé",
	description: null,
	type: "text",
	step: null,
	values: null,
	defaultValue: null,
	helpMessage: "Ex : core.css",
	placeholder: "Clé (ex : core.css)",
	format: {
		value: /^[^\n\r\t]+$/,
		message: "Le format de la clé est incorrect."
	},
	required: {
		value: true,
		message: "La clé est obligatoire."
	},
	min: {
		value: null,
		message: null
	},
	max: {
		value: null,
		message: null
	},
	minLength: {
		value: 1,
		message: "La clé est obligatoire."
	},
	maxLength: {
		value: 255,
		message: "La clé est limitée à 255 caractères."
	},
	messages: null
};