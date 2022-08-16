module.exports = function(ainjs) {
	return [
		{
			methodName: ainjs.checkParameters,
			arguments: [ainjs.parameters, ainjs.formData]
		},
		{
			methodName: ainjs.model.cssCore.bind(ainjs.model),
			arguments: null
		}
	]
};