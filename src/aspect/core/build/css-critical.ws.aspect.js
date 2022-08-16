module.exports = function(ainjs) {
	return [
		{
			methodName: ainjs.checkParameters,
			arguments: [ainjs.parameters, ainjs.formData]
		},
		{
			methodName: ainjs.model.cssCritical.bind(ainjs.model),
			arguments: null
		}
	]
};