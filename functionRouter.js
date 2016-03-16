function route(response, info) {
	response.write("Response message: requested function "+info[0]+" with "+info[1]+" arguments.");
	console.log("Response message: requested function "+info[0]+" with "+info[1]+" arguments.");
}

exports.route = route;