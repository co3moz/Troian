var recursive = require('recursive-readdir-sync');
var fs = require('fs');
var render = require("./render.js");

/**
 * Renders directory
 * @param location Location of file
 * @param sourcehandle control source out of troian
 * @param ref which template system will be used
 */
!function () {
  module.exports = function (location, sourcehandle, ref) {
    ref || (ref = {});

    var fs = require("fs");

    // read dir
    var dir = recursive(location);

    location = location.replace(/\\/g, '/');

    for (file in dir) {
      var x = dir[file].replace(/\\/g, '/').split(location)[1];
      var t = x.split(".");
      // if file is not troian, dont compile..
      if (t[t.length - 1] != "troian") {
        continue;
      }

      t.pop();
      t = t.join(".");

      if (t.indexOf('/') != -1) {
        var sp = t.split('/');
        if (ref[sp[0]] == undefined) {
          ref[sp[0]] = {};
        }

        ref[sp[0]][sp[1]] = render(location + t, sourcehandle, ref);
      } else {
        ref[t] = render(location + t, sourcehandle, ref);
      }
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
          trigger = setTimeout(function () {
            var t = filename.split(".");
            if (t[t.length - 1] != "troian") {
              return;
            }

            t.pop();
            t = t.join(".");

            if (t.indexOf('/') != -1) {
              var sp = t.split('/');
              if (ref[sp[0]] == undefined) {
                ref[sp[0]] = {};
              }

              ref[sp[0]][sp[1]] = render(location + t, sourcehandle, ref);
            } else {
              ref[t] = render(location + t, sourcehandle, ref);
            }
          }, 10);
        }
      }
    });
    return ref;
  };
}();