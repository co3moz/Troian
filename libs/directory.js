/**
 * Renders directory
 * @param location Location of file
 * @param sourcehandle control source out of troian
 * @param ref which template system will be used
 */
!function() {
  module.exports = function(location, sourcehandle, ref) {
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
  };
}();