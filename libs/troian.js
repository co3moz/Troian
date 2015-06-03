var fs = require('fs');
var schema = new String(fs.readFileSync(__dirname + "/troian.schema"));

module.exports = {
	schema: function(file) {
		schema = new String(fs.readFileSync(file)); 
	},

	html: require("/html.js"),
	render: require("/render.js"),
	directory: require("/directory.js")
};