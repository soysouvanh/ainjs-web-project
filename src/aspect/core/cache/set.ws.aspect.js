module.exports = function(ainjs) {
	return [
		// Authenticate user with basic authentication
		// Overwrite authenticate method to customize authentication
		{
			methodName: ainjs.model.authenticate.bind(ainjs.model),
			arguments: null
		},
		
		// Check parameters: key, value
		{
			methodName: ainjs.checkParameters,
			arguments: [ainjs.parameters, ainjs.formData]
		},

		// Execute le main action
		{
			methodName: ainjs.model.set.bind(ainjs.model),
			arguments: null
		}
	]
};