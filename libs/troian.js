var fs = require('fs');
var schema = new String(fs.readFileSync(__dirname + "/troian.schema"));

module.exports = {
	schema: function(file) {
		schema = new String(fs.readFileSync(file)); 
	},
	/**
	  * Default HTML functions
	  */
	html: {
		tag: function(name, option, text) {
			text || (text = "");
			
			var type = typeof option;
			if (type == "object") {
				return ("<" + name + " " + module.exports.html.option(option) + ">" + text + "</" + name + ">");
			} else if (type == "string") {
				return ("<" + name + ">" + option + "</" + name + ">");
			}
		},

		tage: function(name, option) {
			var type = typeof option;
			if (type == "object") {
				return ("<" + name + " " + module.exports.html.option(option) + ">");
			} else {
				return ("<" + name + ">");
			}
		},

		a: function(href, option, text) {
			if(!text) {
				text = option;
				option = {href: href};
			}

			return module.exports.html.tag("a", option, text);
		},

		div: function(option, text) {
			if(!text) {
				text = option;
				option = {};
			}

			return module.exports.html.tag("div", option, text);
		},

		img: function(src, option) {
			option || (option = {});

			option.src = src;
			return module.exports.html.tage("img", option);
		},

		option: function(obj) {
			var temp = "";
			if (obj == undefined) return temp;

			for (i in obj) {
				if (i == "style") {
					temp += i + "=\"" + module.exports.html.style(obj[i]) + "\" ";
				} else {
					temp += i + "=\"" + obj[i] + "\" ";
				}
			}
			return temp;
		},

		style: function(obj) {
			var temp = "";
			if (obj == undefined) return temp;

			for (i in obj) {
				temp += i.replace(/_/g,'-') + ":" + obj[i] + ";"; 
			}
			return temp;
		}
	},
	/**
	  * Renders file
	  * @param location Location of file
	  * @param sourcehandle control source out of troian
	  * @param template which template system will be used
	  */
	render: function(location, sourcehandle, template) {
		var sys = {};
		sys.info = {};

		sys.s = new String(fs.readFileSync(location + ".troian"));
		sys.s = sys.s.replace(/\<\%\(/g, '<% print(');

		sys.g = "";
		sys.parameter = "f, s";

		var html = module.exports.html;
		var render = module.exports.render;
		
		// if troian tag exists do some magic
		var r;
		if (r = /<troian([^>]+|)>([\s\S]*)<\/troian>/.exec(sys.s)) {
			var optreg = /([^=]+) *= *"([^"]*)"/g;
			var spaces = /\s|\r\n|\n|\r/g
			var temp;

			r[1] = r[1].replace(/\\\"/g, "«").replace(/\\\'/g, "»");

			// finds options in troian tag
			while (temp = optreg.exec(r[1])) {
				// crlears spaces from option tag
				var tag = temp[1].replace(spaces,'');

				// collects setting data
				var data = temp[2].replace(/«/g, "\\\"").replace(/»/g, "\\\'");

				// if params option tag  used replace f, s default parameters as we give
				if (tag == "params") {
					sys.parameter = data;
					continue;
				}

				// if success or failed option tags used then fill sys.info
				if (tag == "success" || tag == "failed") {
					if (sys.info[tag]) {
						sys.info[tag] += data + "\n";
					} else {
						sys.info[tag] = data + "\n";
					}
					continue;
				}

				// if its not generic option tag then create variable as given
				eval("var " + tag + " = \"" + data + "\"");
			}

			//static rendering
			var staticReg = /<%static|%>/g;
			var staticTemp = r[2].split(staticReg);
			for (var i = 1;i<staticTemp.length;i+=2) {
				if (staticTemp[i] != undefined) {
					eval(staticTemp[i]);
				}
			}

			//remove troian tag from view
			sys.s = sys.s.replace(r[0], "");
		}
		// split every <% %> tag
		sys.s = sys.s.split(/\<\%|\%\>/g);

		// for each do some math
		for (var i = 0;i<sys.s.length;i++) {
			// first one must be text
			if (sys.s[i] != undefined) {
				sys.g += "print(\"" + sys.s[i].replace(/\\/g,"\\\\").replace(/\"/g, '\\\"').replace(/\r\n|\n|\r/g, '\\n') + "\");\n";
			}

			i++;
			// second one must be code
			if (sys.s[i] != undefined) {
				sys.g += sys.s[i] + "\n";
			}
		}

		// merging schema with readed code
		sys.g = schema.replace("#parameter", sys.parameter).replace("#thecode", sys.g);

		// source Handling
		if (typeof sourcehandle == "function") {
			var result = sourcehandle(sys.g, location);
			if (result != undefined) {
				sys.g = result;
			}
		}

		// success or failed checking..
		try {
			var f = eval(sys.g); f();

			if ((function() {
				eval(sys.info.success || "");
				})(location) == false) {
				process.exit(0);
			}

			return f;
		} catch(e) {
			e = "[error] COMPILE FAILTURE!  " + e;
			console.log(e);

			if ((function() {
				eval(sys.info.failed || "");
				})(location) == false) {
				process.exit(0);
			}
			return (function() { return e; });
		}
	}, 
	/**
	  * Renders directory
	  * @param location Location of file
	  * @param sourcehandle control source out of troian
	  * @param ref which template system will be used
	  */
	directory: function(location, sourcehandle, ref) {
		ref || (ref = {});

		var fs = require("fs");

		// read dir
		var dir = fs.readdirSync(location);

		// for every file compile them
		for (file in dir) {
			var t = dir[file].split(".");
			// if file is not troian, dont compile..
			if (t[t.length - 1] != "troian") {
				continue;
			}

			t.pop();
			t = t.join(".");

			ref[t] = module.exports.render(location + t, sourcehandle, ref); 
		}

		var trigger = {};
		// watching files changed...
		fs.watch(location, function (event, filename) {
		    if (event == "change") {
			    if (filename) {
			    	if (trigger != null) {
			    		clearTimeout(trigger);
			    		trigger = null;
			    	}
			    	// this guy makes bugs disappear. mostly caused by unstable fs.watch function.
			    	trigger = setTimeout(function() { 
				    	var t = filename.split(".");
						if (t[t.length - 1] != "troian") {
							return;
						}

						t.pop();
						t = t.join(".");

				        ref[t] = module.exports.render(location + t, sourcehandle, ref);
			    	}, 10);
			    }
			}
		});
		return ref;
	}
};