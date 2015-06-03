function utility() {

}

/**
 * linkToObject
 *
 * examples
 * a/b => obj.a.b = set
 * a/b/c => obj.a.b.c = set
 * a => obj.a = set
 */
utility.linkToObject = function(obj, link, what) {
  var part = link.split('/');

  if(part.length == 0) {
    obj[link] = what;
    return;
  }

  var k = part.pop();
  var last = obj;
  for(var i in part) {
    if(last[part[i]] == undefined) {
      last[part[i]] = {};
    }
    last = last[part[i]];
  }

  last[k] = what;
};

module.exports = utility;