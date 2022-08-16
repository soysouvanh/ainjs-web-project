module.exports = function(ainjs) {
	return [
		// Check parameters: email, password
		{
			methodName: ainjs.checkParameters,
			arguments: [ainjs.parameters, ainjs.formData]
		},

		// Execute le main action
		{
			methodName: ainjs.model.login.bind(ainjs.model),
			arguments: null
		}
	]
};