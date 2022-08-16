module.exports = {
	label: "Fichier JS",
	title: "Fichier JS",
	description: null,
	type: "text",
	step: null,
	values: null,
	defaultValue: "core.js",
	helpMessage: "Ex : core.js",
	placeholder: "Fichier JS (ex : core.js)",
	format: {
		value: /^[a-zA-Z\d_\-]+(\/[a-zA-Z\d_\-]+)?\.js$/,
		message: "Le format du fichier JS est incorrect."
	},
	required: {
		value: false,
		message: "Le fichier JS est obligatoire."
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
		value: 4,
		message: "Le fichier JS est incorrect."
	},
	maxLength: {
		value: 128,
		message: "Le fichier JS est limité à 128 caractères."
	},
	messages: {
		FileCreation: "Une erreur technique s'est produite.<br/><br/>Si cette erreur persiste, veuillez contacter notre équipe @todo:SITE_NAME depuis le <a href=\"/contact\" title=\"Formulaire de contact\">formulaire de contact</a>.<br/><br/>Soyez assuré(e) que nous mettrons tous les moyens nécessaires pour répondre à votre demande dans les plus brefs délais.<br/><br/>A bientôt,<br/>L'équipe @todo:SITE_NAME.",
	}
};