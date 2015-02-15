# Troian

### How can i install?
	npm install troian

### Pros
* Fast
* Small
* Auto-restart when files changes
* Direct compiling

### Cons
* When you do something stupid, It will not help you :(

### How can i use this
```javascript
var template = require('troian').directory(__dirname + '/views/');
```
Create variable like this. This will load every files on views folder. Then compiles each of them. If this files change during development, system will re-compile file automaticly. 
```javascript
template.index();
```
`index` is actually file name without `.troian`. And we writed parantheses for function calling. Compiling process will return as a function.
If we write some params on it; we can get it from index.troian file as down below

###### app.js
```javascript
template.index(1, "hello");
```

###### views/index.troian
```javascript
<troian params="number, text">Info or blank .. This text will removed</troian>
<%
  print(number);
  print(text);
  /*
  	inline printing is down below
  */
%>
<%( number )%> <br>
<%(text)%>
```

### Express Example
###### app.js
```javascript
var express = require('express');
var troian = require('troian');
var app = express();

var template = troian.directory(__dirname + '/views/');

app.get('/', function(req, res) {
	res.send(template.index());
});

app.listen(80, function() {
	console.log("app started");
});
```

###### views/index.troian
```html
<troian title="This is an example">
	We can give any info here. It will be removed from view.
	This is main page. Everything comes from this
</troian>
<%
	var header = template.header(title);
	print("User controlled print function");
%>

<html>
<%(header)%>
<body>
<%
	for(var i = 1; i<10;i++) {
%>
 This is the number <%(i)%><br>
<%
	}
%>
</body>
</html>
```

##### views/header.troian
```html
<troian params="title" myvariable="this is what i want">
	We can give any info here. It will be removed from view.
	This page is header. it prints title and scripts..
</troian>
<%
  print(myvariable);
%>
<head>
	<title><%(title)%></title>
</head>
```

### Other awesome features

##### success option tag and failed option tag
This option tags can be used as understanding views compiled successfuly or not. 
If you write return false, it causes process exit. Stops everything.
If you want to debug all troian files for ones you dont need return false;
return false can be used in both success and failed option tags..
```html
<troian 
	params="title" 
	success="console.log('im ready)"
	failed="console.log('i pissed my self sorry :(. im closing the application'); return false;">
	We can give any info here. It will be removed from view.
</troian>
```

##### static tag
You can define static operations in troian tag.
```html
<troian title="This is an example" 
		success="return success()"
		failed="return failed()">
	We can give any info here. It will be removed from view.
	<%static
		function success() {
			console.log('index has been successfuly compiled');
		}

		function failed() {
			console.log('index has been failed at compiling process')
			return false;
		}

		console.log("hello");
	%>
</troian>
```

```html
<troian title="This is an example" >
	We can give any info here. It will be removed from view.
	<%static
		var a = 1;
	%>
</troian>


<html>
<body>
<%
	print("visit count :" + (a++) + "<br>");
%>
</body>
</html>
```

##### own schema
If you want to do some special addon or some feature that effects every page, you just simply define own schema.
###### app.js
```javascript
troian.schema(__dirname + '/my.schema');
var template = troian.directory(__dirname + '/views/');
```

###### my.schema
```javascript
(function(#parameter) {
	var p = arguments;

	var _$='';

	function print(w) {
		_$ += w;
	}

	function hello() {
		return "hi :)";
	}

	#thecode

	return _$;
});
```

***note: in schema you must define print function..***

##### html tags
```html
<troian>
	We can give any info here. It will be removed from view.
	<%static
		var mydiv = html.tag("div", {
			id: "mydiv",
			class: "hello",
			style: {
				color: "red",
				font_size: "12pt"
			}
		});

		var img = html.img("/hello.png");

		var handbyimg = html.tage("img", {
			src: "/hello.png"
		});

		var biggerbrother = html.tag("div", {
			class: "biggerbrother",
			style: {
				width: "20px",
				height: "20px"
			}
		}, mydiv + img);

		var withoutoptions = html.tag("div", mydiv + img);
	%>
</troian>
<!-- Only rendered ones -->
<%(biggerbrother)%>

<!-- Rendering every request -->
<%(html.a("/link", "This is a link"))%>
```