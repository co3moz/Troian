# Troian
Fast Javascript based template manager

### How can i install?
	npm install troian

### Pros
* Fast
* Small
* Auto-restart when files changes
* Direct compiling

### Cons
* When you do something stupid, It will not help you :(

### How can i use this sh*t
```javascript
var template = require('troian').directory(__dirname + '/views/');
```
Create variable like this. This will load every files on views folder. Then compiles each of them. If this files change during development, system will re-compile file automaticly. 
```javascript
template.index();
```
`index` is actually file name without `.troian`. And we writed parantheses for function calling. Compiling process will return as a function.
If we write some params on it; we can get it from index.troian file as down below

##### app.js
```javascript
template.index(1, "hello");
```

##### views/index.troian
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
##### app.js
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

##### views/index.troian
```html
<troian title="This is an example">
	We can give any info here. It will be removed from view.
	This is main page. Everything comes from this f*g.
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

### Other awesome features :D

##### compiled tag
```html
<troian params="title" compiled="console.log('im now compiled')">
	We can give any info here. It will be removed from view.
</troian>
```
