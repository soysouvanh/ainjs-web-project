module.exports = {
	label: "Fichier CSS",
	title: "Fichier CSS",
	description: null,
	type: "text",
	step: null,
	values: null,
	defaultValue: "core.css",
	helpMessage: "Ex : core.css",
	placeholder: "Fichier CSS (ex : core.css)",
	format: {
		value: /^[a-zA-Z\d_\-]+(\/[a-zA-Z\d_\-]+)?\.css$/,
		message: "Le format du fichier CSS est incorrect."
	},
	required: {
		value: false,
		message: "Le fichier CSS est obligatoire."
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
		message: "Le fichier CSS est incorrect."
	},
	maxLength: {
		value: 128,
		message: "Le fichier CSS est limité à 128 caractères."
	},
	messages: {
		FileCreation: "Une erreur technique s'est produite.<br/><br/>Si cette erreur persiste, veuillez contacter notre équipe @todo:SITE_NAME depuis le <a href=\"/contact\" title=\"Formulaire de contact\">formulaire de contact</a>.<br/><br/>Soyez assuré(e) que nous mettrons tous les moyens nécessaires pour répondre à votre demande dans les plus brefs délais.<br/><br/>A bientôt,<br/>L'équipe @todo:SITE_NAME.",
	}
};