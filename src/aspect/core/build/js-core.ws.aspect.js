module.exports = function(ainjs) {
	return [
		{
			methodName: ainjs.checkParameters,
			arguments: [ainjs.parameters, ainjs.formData]
		},
		{
			methodName: ainjs.model.jsCore.bind(ainjs.model),
			arguments: null
		}
	]
};