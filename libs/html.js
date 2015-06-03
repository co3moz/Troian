/**
 * HTML generators
 */
!function() {
  module.exports = {
    tag: function (name, option, text) {
      text || (text = "");

      var type = typeof option;
      if (type == "object") {
        return ("<" + name + " " + module.exports.html.option(option) + ">" + text + "</" + name + ">");
      } else if (type == "string") {
        return ("<" + name + ">" + option + "</" + name + ">");
      }
    },

    tage: function (name, option) {
      var type = typeof option;
      if (type == "object") {
        return ("<" + name + " " + module.exports.html.option(option) + ">");
      } else {
        return ("<" + name + ">");
      }
    },

    a: function (href, option, text) {
      if (!text) {
        text = option;
        option = {href: href};
      }

      return module.exports.html.tag("a", option, text);
    },

    div: function (option, text) {
      if (!text) {
        text = option;
        option = {};
      }

      return module.exports.html.tag("div", option, text);
    },

    img: function (src, option) {
      option || (option = {});

      option.src = src;
      return module.exports.html.tage("img", option);
    },

    option: function (obj) {
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

    style: function (obj) {
      var temp = "";
      if (obj == undefined) return temp;

      for (i in obj) {
        temp += i.replace(/_/g, '-') + ":" + obj[i] + ";";
      }
      return temp;
    }
  };
}();