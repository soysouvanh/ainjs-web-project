// Declare global variables
global.HOME_URL = "https://ainjs.com";
global.SITE_NAME = "AiNJS";
global.AUTHOR = "Vincent SOYSOUVANH";

// Create server
const http = require("http");
const server = http.createServer(function (req, res) {
	// Load Ainjs class
	const Ainjs = require(__dirname + "/index.js");
	
	// Run request: route is automatic
	new Ainjs({
		http: http,
		request: req,
		response: res,
		template: "default"	// Template name corresponding to "/src/template/default.template.ejs" file
	}).run();
});

// Listen requests
server.listen(8080, () => {
	console.log("Server started at port 8080");
});


/*
const fastify = require("fastify")({logger: true});
fastify.get('/', (request, reply) => {
	reply.send({ hello: 'world' })
});
fastify.listen({ port: 8080 }, (err, address) => {
	// Case error
	if(err) {
		throw err;
	}

	// Server is now listening on ${address}
	console.log("Server is now listening on " + address);
});
*/