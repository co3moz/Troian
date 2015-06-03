var fs = require('fs');
var schema = String(fs.readFileSync(__dirname + "/troian.schema"));

/**
 * Renders file
 * @param location Location of file
 * @param sourcehandle control source out of troian
 * @param template which template system will be used
 */
!function () {
  module.exports = function (location, sourcehandle, template) {
    var sys = {};

    sys.s = String(fs.readFileSync(location + ".troian"));
    sys.s = sys.s.replace(/\<\%\+\(/g, '<%(template.');
    sys.s = sys.s.replace(/\<\%\(/g, '<% print(');

    sys.g = "";
    sys.parameter = "f, s";

    var html = require("./html.js");
    var render = module.exports;

    // if troian tag exists do some magic
    var r;
    if (r = /<troian([^>]+|)>([\s\S]*)<\/troian>/.exec(sys.s)) {
      var optreg = /([^=]+) *= *"([^"]*)"/g;
      var spaces = /\s|\r\n|\n|\r/g
      var temp;

      r[1] = r[1].replace(/\\\"/g, "«").replace(/\\\'/g, "»");

      // finds options in troian tag
      while (temp = optreg.exec(r[1])) {
        // clears spaces from option tag
        var tag = temp[1].replace(spaces, '');

        // collects setting data
        var data = temp[2].replace(/«/g, "\\\"").replace(/»/g, "\\\'");

        // if params option tag  used replace f, s default parameters as we give
        if (tag == "params") {
          sys.parameter = data;
          continue;
        }

        // if its not generic option tag then create variable as given
        eval("var " + tag + " = \"" + data + "\"");
      }

      //static rendering
      var staticReg = /<%static|%>/g;
      var staticTemp = r[2].split(staticReg);
      for (var i = 1; i < staticTemp.length; i += 2) {
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
    for (var i = 0; i < sys.s.length; i++) {
      // first one must be text
      if (sys.s[i] != undefined) {
        sys.g += "print(\"" + sys.s[i].replace(/\\/g, "\\\\").replace(/\"/g, '\\\"').replace(/\r\n|\n|\r/g, '\\n') + "\");\n";
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
      return eval(sys.g);
    } catch (e) {
      e = "[error] COMPILE FAILTURE!  " + e;
      console.log(e);

      return (function () {
        return e;
      });
    }
  };
}();