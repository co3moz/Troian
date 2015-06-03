var recursive = require('recursive-readdir-sync');
var watch = require('fs-watch-tree').watchTree;
var fs = require('fs');
var render = require("./render.js");
var utility = require("./utility.js");

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

      utility.linkToObject(ref, t, render(location + t, sourcehandle, ref));
    }

    var trigger = null;
    // watching files changed...
    watch(location, function (event, filename) {
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


            utility.linkToObject(ref, t, render(location + t, sourcehandle, ref));
          }, 10);
        }
      }
    });
    return ref;
  };
}();