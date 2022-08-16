module.exports = function(ainjs) {
	return [
		// Authenticate user with basic authentication
		// Overwrite authenticate method to customize authentication
		{
			methodName: ainjs.model.authenticate.bind(ainjs.model),
			arguments: null
		},
		
		// No parameter to check
		// {
		// 	methodName: ainjs.checkParameters,
		// 	arguments: [ainjs.parameters, ainjs.formData]
		// },

		// Execute le main action
		{
			methodName: ainjs.model.getMethod.bind(ainjs.model),
			arguments: null
		}
	]
};